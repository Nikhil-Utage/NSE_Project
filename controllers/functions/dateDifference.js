function getDateDifference(date1Str, date2Str) {
  try {
    const date1 = new Date(date1Str);
    const date2 = new Date(date2Str);

    const timeDifference = Math.abs(date1 - date2);

    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference;
  } catch (err) {
    return 0;
  }
}

function getDaysFromCurrentDate(dateStr) {
  try {
    const inputDate = new Date(dateStr);

    const currentDate = new Date();

    const timeDifference = Math.abs(currentDate - inputDate);

    const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    return dayDifference;
  } catch (err) {
    return 0;
  }
}

module.exports = { getDateDifference, getDaysFromCurrentDate };
