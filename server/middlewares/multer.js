import multer from 'multer';
const storage = multer.memoryStorage();
export const uploadSingleFile = multer({ storage }).single('file');
const uploadFile = multer({ storage }).array('file', 10);

export default uploadFile;
