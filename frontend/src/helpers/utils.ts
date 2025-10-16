
const truncateString = (str: string | undefined | null): string | null => {
    if (!str || str === 'undefined') {
      return null;
    }
    if (str.length <= 25) {
      return str;
    }
    return str.slice(0, 10) + '...' + str.slice(-12);
};

export default truncateString;