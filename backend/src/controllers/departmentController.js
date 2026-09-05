/**
 * Department Controller
 * HTTP request handlers for department endpoints.
 * Thin layer that delegates to the service and formats responses.
 */

const departmentService = require('../services/departmentService');

class DepartmentController {
  async list(req, res, next) {
    try {
      const result = await departmentService.findAll(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await departmentService.findById(req.params.id);
      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const result = await departmentService.create(req.body, req.user);
      res.status(result.statusCode || 201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await departmentService.update(req.params.id, req.body, req.user);
      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const hard = req.query.hard === 'true';
      const result = await departmentService.remove(req.params.id, req.user, hard);
      if (!result.success) {
        return res.status(result.statusCode || 404).json(result);
      }
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async export(req, res, next) {
    try {
      const format = req.query.format || 'json';
      const data = await departmentService.exportData(req.query, format);
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="departments.csv"`);
        return res.send(data);
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new DepartmentController();
// Feature: Department Units and Org Hierarchy Chart 
