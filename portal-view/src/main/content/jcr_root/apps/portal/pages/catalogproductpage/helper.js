use(function () {
    var result;
    var value = this.value;
    var type = this.type;
    var count = this.count;
    var isNumberBoolean;
    var isMultiply;
    var path;
    switch(type) {
        case 'size':
            result = value.replace(","," x ");
            break;
        case 'attitude':
            result = value.replace(","," / ");
            break;
        case 'interval':
            result = value.replace(","," - ");
            break;
        case 'enum':
            result = value.replace(",",", ");
            break;
        case 'numberBoolean':
            result = '';
            isNumberBoolean = true;
            path = count == 0 ? '/content/dam/portal/catalog/w128h1281338911594close.png' : '/content/dam/portal/catalog/galochka.png'
            isMultiply = count > 1;
            break;
        default:
            result = value;
    }

    return {
        'value': result,
        'isNumberBoolean' : isNumberBoolean,
        'count' : count,
        'path' : path,
        'isMultiply' : isMultiply
    };
});
