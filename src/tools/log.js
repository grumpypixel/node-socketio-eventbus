import logger from 'debug';

const debug = logger('DEBUG');
const trace = logger('TRACE');
const error = logger('ERROR');

export default { debug, trace, error };
