import LiveScore from '../models/LiveScore.js';

// Get all matches
export const getMatches = async (req, res) => {
  try {
    const { status } = req.query;
    let filter = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    const matches = await LiveScore.find(filter)
      .populate('updatedBy', 'firstName lastName')
      .sort('-matchDate');

    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single match
export const getMatch = async (req, res) => {
  try {
    const match = await LiveScore.findById(req.params.id)
      .populate('updatedBy', 'firstName lastName');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    res.status(200).json({
      success: true,
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create match (Admin only)
export const createMatch = async (req, res) => {
  try {
    const { matchTitle, homeTeam, awayTeam, matchDate, matchTime, venue, competition } = req.body;

    if (!matchTitle || !homeTeam || !awayTeam || !matchDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide match details'
      });
    }

    const match = await LiveScore.create({
      matchTitle,
      homeTeam,
      awayTeam,
      matchDate,
      matchTime: matchTime || '',
      venue: venue || '',
      competition: competition || 'Ethiopian Premier League',
      status: 'upcoming',
      updatedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: 'Match created successfully',
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update match score (Admin only)
export const updateMatchScore = async (req, res) => {
  try {
    const { homeScore, awayScore, status } = req.body;

    let match = await LiveScore.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    if (homeScore !== undefined) match.homeScore = homeScore;
    if (awayScore !== undefined) match.awayScore = awayScore;
    if (status) match.status = status;

    match.updatedBy = req.user.id;
    match.updatedAt = Date.now();

    await match.save();

    await match.populate('updatedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Match score updated successfully',
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update match details (Admin only)
export const updateMatch = async (req, res) => {
  try {
    const { matchTitle, homeTeam, awayTeam, matchDate, matchTime, venue, competition, status, lineups, statistics, highlights } = req.body;

    let match = await LiveScore.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    if (matchTitle) match.matchTitle = matchTitle;
    if (homeTeam) match.homeTeam = homeTeam;
    if (awayTeam) match.awayTeam = awayTeam;
    if (matchDate) match.matchDate = matchDate;
    if (matchTime) match.matchTime = matchTime;
    if (venue) match.venue = venue;
    if (competition) match.competition = competition;
    if (status) match.status = status;
    if (lineups) match.lineups = lineups;
    if (statistics) match.statistics = statistics;
    if (highlights) match.highlights = highlights;

    match.updatedBy = req.user.id;
    match.updatedAt = Date.now();

    await match.save();

    await match.populate('updatedBy', 'firstName lastName');

    res.status(200).json({
      success: true,
      message: 'Match updated successfully',
      data: match
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete match (Admin only)
export const deleteMatch = async (req, res) => {
  try {
    const match = await LiveScore.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found'
      });
    }

    await LiveScore.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Match deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get upcoming matches
export const getUpcomingMatches = async (req, res) => {
  try {
    const matches = await LiveScore.find({ status: 'upcoming' })
      .sort('matchDate')
      .limit(5);

    res.status(200).json({
      success: true,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get recent results
export const getRecentResults = async (req, res) => {
  try {
    const matches = await LiveScore.find({ status: 'finished' })
      .sort('-matchDate')
      .limit(5);

    res.status(200).json({
      success: true,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
