import { types } from "pg";

// INT8
types.setTypeParser(20, (val: string) => parseInt(val, 10));

// NUMERIC
types.setTypeParser(1700, (val: string) => parseFloat(val));
