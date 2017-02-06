export default{
  serialize(formData) {
    const res = [];
    for (const key of Object.keys(formData)) {
      if (formData[key] instanceof Array) {
        for (const value of formData[key]) {
          res.push(`${key}=${window.encodeURIComponent(value)}`);
        }
      } else {
        res.push(`${key}=${formData[key]}`);
      }
    }
    return res.join('&');
  },

  resetForm(formData) {
    for (const key of Object.keys(formData)) {
      if (formData[key] instanceof Array) {
        formData[key] = [];
      } else {
        formData[key] = '';
      }
    }
  },

  typeof(obj) {
    return Object.prototype.toString.call(obj).substring(8).replace(']', '').toLowerCase();
  },
};
