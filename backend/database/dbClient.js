const fs = require('fs');
const path = require('path');
const { getDbType } = require('../config/db');

// Mongoose Models
const User = require('../models/User');
const Employee = require('../models/Employee');
const Client = require('../models/Client');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Ticket = require('../models/Ticket');

// JSON DB Directory
const STORAGE_DIR = path.join(__dirname, 'storage');
if (!fs.existsSync(STORAGE_DIR)) {
  fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

// JSON Database Helper
class JsonRepository {
  constructor(modelName) {
    this.modelName = modelName;
    this.filePath = path.join(STORAGE_DIR, `${modelName.toLowerCase()}s.json`);
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  readData() {
    try {
      const content = fs.readFileSync(this.filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return [];
    }
  }

  writeData(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // Sync methods for internal population use
  findByIdSync(id) {
    if (!id) return null;
    const items = this.readData();
    return items.find(item => item._id === id.toString() || item.id === id.toString()) || null;
  }

  async find(filter = {}) {
    let items = this.readData();
    // Filter matching
    items = items.filter(item => {
      for (let key in filter) {
        // Handle search queries
        if (typeof filter[key] === 'object' && filter[key] !== null) {
          // If regex-like search
          if (filter[key].$regex) {
            const regex = new RegExp(filter[key].$regex, filter[key].$options || 'i');
            if (!regex.test(item[key] || '')) return false;
            continue;
          }
        }
        
        // Exact match
        if (item[key] !== undefined && item[key] !== null) {
          if (item[key].toString() !== filter[key].toString()) return false;
        } else {
          return false;
        }
      }
      return true;
    });
    return new JsonQuery(items, this);
  }

  async findOne(filter = {}) {
    const items = await this.find(filter);
    return items.data[0] || null;
  }

  async findById(id) {
    const items = this.readData();
    const item = items.find(item => item._id === id.toString() || item.id === id.toString()) || null;
    return new JsonQuery(item, this);
  }

  async create(data) {
    const items = this.readData();
    const newItem = {
      _id: Math.random().toString(36).substring(2, 11) + Math.random().toString(36).substring(2, 11),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    items.push(newItem);
    this.writeData(items);
    return newItem;
  }

  async findByIdAndUpdate(id, updateData, options = {}) {
    const items = this.readData();
    const index = items.findIndex(item => item._id === id.toString() || item.id === id.toString());
    if (index === -1) return null;

    // Handle $push (for array fields like comments or notes)
    if (updateData.$push) {
      for (let arrayField in updateData.$push) {
        if (!items[index][arrayField]) {
          items[index][arrayField] = [];
        }
        items[index][arrayField].push({
          _id: Math.random().toString(36).substring(2, 6),
          ...updateData.$push[arrayField],
          timestamp: new Date().toISOString(),
          date: new Date().toISOString()
        });
      }
      delete updateData.$push;
    }

    // Direct assignment updates
    items[index] = {
      ...items[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    this.writeData(items);
    return items[index];
  }

  async findByIdAndDelete(id) {
    const items = this.readData();
    const index = items.findIndex(item => item._id === id.toString() || item.id === id.toString());
    if (index === -1) return null;
    const deleted = items.splice(index, 1)[0];
    this.writeData(items);
    return deleted;
  }
}

// Chainable mock Mongoose Query class
class JsonQuery {
  constructor(data, repository) {
    this.data = data;
    this.repository = repository;
  }

  populate(field) {
    if (!this.data) return this;
    const isArray = Array.isArray(this.data);
    const items = isArray ? this.data : [this.data];

    items.forEach(item => {
      if (!item[field]) return;
      
      let refModel = '';
      if (field === 'user' || field === 'assignedTo' || field === 'raisedBy' || field === 'client') {
        refModel = 'User';
      } else if (field === 'project') {
        refModel = 'Project';
      } else if (field === 'team') {
        refModel = 'User';
      }

      if (refModel) {
        const refRepo = dbClient[`${refModel.toLowerCase()}s`].repository;
        if (Array.isArray(item[field])) {
          item[field] = item[field].map(id => refRepo.findByIdSync(id)).filter(Boolean);
        } else {
          item[field] = refRepo.findByIdSync(item[field]);
        }
      }
    });

    return this;
  }

  select(fields) {
    // Simple password stripping mock
    if (fields === '+password' && !Array.isArray(this.data)) {
      // Don't strip password (handled during login/comparison)
    }
    return this;
  }

  // Promise resolution compat
  then(onFulfilled, onRejected) {
    return Promise.resolve(this.data).then(onFulfilled, onRejected);
  }
}

// The Unified Database Client
const dbClient = {
  get users() {
    return getDbType() === 'mongodb' ? User : new JsonRepository('User');
  },
  get employees() {
    return getDbType() === 'mongodb' ? Employee : new JsonRepository('Employee');
  },
  get clients() {
    return getDbType() === 'mongodb' ? Client : new JsonRepository('Client');
  },
  get projects() {
    return getDbType() === 'mongodb' ? Project : new JsonRepository('Project');
  },
  get tasks() {
    return getDbType() === 'mongodb' ? Task : new JsonRepository('Task');
  },
  get tickets() {
    return getDbType() === 'mongodb' ? Ticket : new JsonRepository('Ticket');
  }
};

module.exports = dbClient;
