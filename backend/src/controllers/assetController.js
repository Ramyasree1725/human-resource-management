/**
 * Asset Controller
 * HTTP request handlers for asset endpoints.
 * Thin layer that delegates to the service and formats responses.
 */

const assetService = require('../services/assetService');

class AssetController {
  async list(req, res, next) {
    try {
      const result = await assetService.findAll(req.query);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const result = await assetService.findById(req.params.id);
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
      const result = await assetService.create(req.body, req.user);
      res.status(result.statusCode || 201).json(result);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const result = await assetService.update(req.params.id, req.body, req.user);
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
      const result = await assetService.remove(req.params.id, req.user, hard);
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
      const data = await assetService.exportData(req.query, format);
      if (format === 'csv') {
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename="assets.csv"`);
        return res.send(data);
      }
      res.status(200).json({ success: true, data });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AssetController();
