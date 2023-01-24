const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError, CustomAPIError } = require("../errors");
const job = require("../models/Job");

//To create a job
const createJob = async function (req, res) {
  try {
    console.log("creation started with =", req.user.userId);
    req.body.createdBy = req.user.userId;
    const createdJob = await job.create(req.body);
    res.status(StatusCodes.CREATED).json({ createdJob });
  } catch (err) {
    console.log("error in creation is = ", err.message);
  }
};

// to fetch all the created jobs by a particular user
const getAllJobs = async function (req, res) {
  console.log("Job details starts");
  try {
    const jobs = await job
      .find({ createdBy: req.user.userId })
      .sort("createdAt");
    if (jobs == "") {
      console.log("ritik");
      res.status(StatusCodes.NOT_FOUND).json("No jobs created");
    }
    res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
  } catch (err) {
    console.log("error in getitng all are=", err.message);
  }
};

// to fetch a particular job
const getSingleJob = async function (req, res) {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;
  try {
    console.log("finding of job starts", req.params.id);
    const singleJob = await job.findOne({
      _id: jobId,
      createdBy: userId,
    });
    if (!singleJob) {
      res.status(StatusCodes.NOT_FOUND).json(`No job with this ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ singleJob });
  } catch (err) {
    console.log("error in getting a single job is = ", err.message);
  }
};

// to delete a job
const deleteJob = async function (req, res) {
  console.log("Deletion of job starts", req.params.id);
  try {
    const {
      user: { userId },
      params: { id: jobId },
    } = req;
    const deleteToBe = await job.findByIdAndRemove({
      _id: jobId,
      createdBy: userId,
    });
    if (!deleteToBe) {
      throw new NotFoundError("Id to be deleted not found.");
    }
    res.status(StatusCodes.OK).json({ removed_user: deleteToBe });
  } catch (err) {
    console.log("Error in deletion is = ", err.message);
  }
};

//to update a job
const updateJob = async function (req, res) {
  console.log("updation of job starts", req.params.id);
  try {
    const {
      body: { company, position },
      params: { id: jobId },
      user: { userId },
    } = req;
    if (company == "" || position == "") {
      throw new BadRequestError("Company and position fields cant be empty.");
    }
    const updatedJob = await job.findByIdAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJob) {
      throw new NotFoundError(`No job with ${jobId}`);
    }
    res.status(StatusCodes.OK).json({ updatedJob });
  } catch (err) {
    console.log("error in updation is=", err.message);
  }
};

module.exports = {
  createJob,
  getAllJobs,
  deleteJob,
  getSingleJob,
  updateJob,
};
