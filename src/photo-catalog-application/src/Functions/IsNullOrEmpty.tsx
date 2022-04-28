const isNullOrWhiteSpace = (value: any) => {
  if (!value || value.trim().length === 0 || value === " ") {
    return true;
  } else {
    return false;
  }
};

export default isNullOrWhiteSpace;
