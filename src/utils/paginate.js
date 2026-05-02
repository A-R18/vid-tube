import mongoose from "mongoose";
const paginate = async (incomingPage, count) => {
  const page = Math.max(1, parseInt(incomingPage) || 1);
  const limit = 2;
  const offset = (page - 1) * limit;
  const lastPage = Math.ceil(count / limit);
  return { page, lastPage, offset, limit };
};

export { paginate };
