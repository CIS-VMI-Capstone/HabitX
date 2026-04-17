import Parse from 'parse';

const APP_ID = import.meta.env.VITE_PARSE_APP_ID;
const JS_KEY = import.meta.env.VITE_PARSE_JS_KEY;

if (!APP_ID || !JS_KEY) {
  console.warn(
    '[HabitX] Back4App credentials not found.\n' +
    'Copy .env.example to .env and add your VITE_PARSE_APP_ID and VITE_PARSE_JS_KEY.'
  );
}

Parse.initialize(APP_ID || 'MISSING_APP_ID', JS_KEY || 'MISSING_JS_KEY');
Parse.serverURL = 'https://parseapi.back4app.com/';

export default Parse;
