module.exports = (value) => {
        let isValid = true;
            if (!value || !value.trim()) {
                isValid = false;
            }
        return isValid;
    };
