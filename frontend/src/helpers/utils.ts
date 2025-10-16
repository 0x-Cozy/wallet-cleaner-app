
const truncateString = (str: string | undefined | null): string | null => {
    if (!str || str === 'undefined') {
      return null;
    }
    if (str.length <= 30) {
      return str;
    }
    return str.slice(0, 18) + '...' + str.slice(-15);
};

export default truncateString;