import Player from '../models/Player.js';

// Get all players with optional position filtering
export const getPlayers = async (req, res, next) => {
  try {
    const { position, country } = req.query;
    const filter = { isActive: true };
    if (position) filter.position = position;
    if (country) filter.country = country;

    const players = await Player.find(filter).sort({ number: 1 });
    res.status(200).json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    next(error);
  }
};

// Get single player
export const getPlayer = async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Create player
export const createPlayer = async (req, res, next) => {
  try {
    const player = await Player.create(req.body);
    res.status(201).json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Update player
export const updatePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    res.status(200).json({
      success: true,
      data: player
    });
  } catch (error) {
    next(error);
  }
};

// Admin: Delete player
export const deletePlayer = async (req, res, next) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) {
      return res.status(404).json({
        success: false,
        message: 'Player not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Player removed successfully'
    });
  } catch (error) {
    next(error);
  }
};
