import mongoose from "mongoose";
const paginate = async (incomingPage, model) => {
    const Video = await import(`../models/${model}.model.js`);
    const page = Math.max(1, parseInt(incomingPage) || 1);
    const count = await Video.Video.countDocuments();
    const limit = 2;
    const offset = (page - 1) * limit;
    const lastPage = Math.ceil(count/limit);
    return { page, lastPage, count, offset, limit };
}

export {
    paginate
}