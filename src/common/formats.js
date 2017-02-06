function formatTime(time, format = 'yyyy-MM-dd hh:mm:ss.S') {
  const timeObj = new Date(time);
  const o = {
    'M+': timeObj.getMonth() + 1,
    'd+': timeObj.getDate(),
    'h+': timeObj.getHours(),
    'm+': timeObj.getMinutes(),
    's+': timeObj.getSeconds(),
    S: timeObj.getMilliseconds(),
  };
  if (/(y+)/.test(format)) {
    const year = String(timeObj.getFullYear());
    const matched = RegExp.$1;
    format = format.replace(matched, year.substr(4 - matched.length));
  }
  for (const key of Object.keys(o)) {
    if (new RegExp(`(${key})`).test(format)) {
      const matched = RegExp.$1;
      format = format.replace(matched, matched.length === 1 ? o[key] : `00${o[key]}`.substr(String(o[key]).length));
    }
  }
  return format;
}

export default{
  formatTime,
};
