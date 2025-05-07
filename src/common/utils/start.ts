import connectDB from '../db/config';
// import kafka from './kafka';

const start = async () => {
  connectDB();
  // await kafka.initializeKafka();
};
export default start;
