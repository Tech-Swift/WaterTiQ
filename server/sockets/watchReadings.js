// sockets/watchReadings.js
const { Reading } = require('../models/Reading');

const watchReadings = (io, mongoose) => {
  mongoose.connection.once('open', () => {
    console.log('👀 Watching Reading collection for changes...');

    const changeStream = Reading.watch();

    changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
        const newReading = change.fullDocument;
        io.emit('newReading', {
          meterId: newReading.meterId,
          propertyId: newReading.propertyId,
          readingValue: newReading.readingValue,
          time: newReading.createdAt,
        });
        console.log('📡 Broadcasted new reading:', newReading._id);
      }
    });
  });
};

module.exports = watchReadings;
