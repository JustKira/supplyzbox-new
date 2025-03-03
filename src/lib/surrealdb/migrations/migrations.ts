const surql001 = `
DEFINE TABLE OVERWRITE user SCHEMALESS;
DEFINE FIELD OVERWRITE email ON TABLE user TYPE string;
DEFINE FIELD OVERWRITE phone_number ON TABLE user TYPE option<string>;
DEFINE ANALYZER OVERWRITE email_analyzer TOKENIZERS blank FILTERS lowercase, ascii, ngram(3,5);
DEFINE ANALYZER OVERWRITE phone_analyzer TOKENIZERS blank FILTERS ngram(3,5);
DEFINE INDEX OVERWRITE email_index ON user FIELDS email SEARCH ANALYZER email_analyzer BM25;
DEFINE INDEX OVERWRITE phone_index ON user FIELDS phone_number SEARCH ANALYZER phone_analyzer BM25;

DEFINE ANALYZER OVERWRITE name_analyzer TOKENIZERS blank FILTERS lowercase, ascii, edgengram(2,5);
DEFINE TABLE OVERWRITE product SCHEMALESS;
DEFINE FIELD OVERWRITE name ON TABLE product TYPE string;
DEFINE INDEX OVERWRITE name_index ON product FIELDS name SEARCH ANALYZER name_analyzer BM25;
`;
export const migrations: string[] = [surql001];
