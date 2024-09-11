const db = require('../config/database');

class Document {
  static async create(title, content, path) {
    const [result] = await db.execute(
      'INSERT INTO documents (title, content, path) VALUES (?, ?, ?)',
      [title, content, path]
    );
    return result.insertId;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM documents WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id, title, content, path) {
    if (!id || isNaN(id)) {
      throw new Error('Invalid document ID');
    }
    await db.execute(
      'UPDATE documents SET title = ?, content = ?, path = ? WHERE id = ?',
      [title || '', content || '', path || '', id]
    );
  }

  static async delete(id) {
    await db.execute('DELETE FROM documents WHERE id = ?', [id]);
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM documents ORDER BY path');
    return rows;
  }

  static async findByPath(path) {
    const [rows] = await db.execute('SELECT * FROM documents WHERE path LIKE ?', [`${path}%`]);
    return rows;
  }

  static async getAll() {
    try {
      const [rows] = await db.execute('SELECT * FROM documents');
      return rows;
    } catch (error) {
      console.error('Error fetching all documents:', error);
      throw error;
    }
  }
}

module.exports = Document;