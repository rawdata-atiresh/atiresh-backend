
import { diskStorage } from 'multer';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';


export const multerOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            console.log(req.body)
            const uploadPath = join(__dirname, `../Uploads/${req.body.project}/${req.body.path}`)
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file.originalname)
            req.body.filename = file.originalname
            return cb(null, file.originalname)
        }
    })
}

export const UploadLogo = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            // console.log(req.body)
            const uploadPath = join(__dirname, `../`, 'public')
            console.log("upload path",uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            console.log("logo",req.body.logo)
            req.body.logo = name;
            return cb(null, name)
        }
    })
}

export const uploadMajorPdf = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            // console.log(req.body)
            const uploadPath = join(__dirname, `../`, 'public','majorChangeControl')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            //req.body.logo = name;
            return cb(null, name)
        }
    })
}
export const uploadKbir4Attachment = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            // console.log(req.body)
            const uploadPath = join(__dirname, `../`, 'public','kbirStage4')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            //req.body.logo = name;
            return cb(null, name)
        }
    })
}
export const uploadKbir5Attachment = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            // console.log(req.body)
            const uploadPath = join(__dirname, `../`, 'public','kbirStage5')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            //req.body.logo = name;
            return cb(null, name)
        }
    })
}
export const uploadNonMajorPdf = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            // console.log(req.body)
            const uploadPath = join(__dirname, `../`, 'public','nonMajorChangeControl')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            //req.body.logo = name;
            return cb(null, name)
        }
    })
}
export const UploadMandatoryDocs = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            //console.log("inside mor upload",req.body)
            const uploadPath = join(__dirname, `../`, 'public','mor')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            //console.log("inside filename",req.body.mandatoryDocuments[0].fileName)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            // req.body.mandatoryDocuments=[];
            // req.body.mandatoryDocuments.push(name)
            return cb(null, name)
        }
    })
}
export const UploadKbir4Docs = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            //console.log("inside mor upload",req.body)
            const uploadPath = join(__dirname, `../`, 'public','kbirStage4')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            //console.log("inside filename",req.body.mandatoryDocuments[0].fileName)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            // req.body.mandatoryDocuments=[];
            // req.body.mandatoryDocuments.push(name)
            return cb(null, name)
        }
    })
}
export const UploadKbir5Docs = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            //console.log("inside mor upload",req.body)
            const uploadPath = join(__dirname, `../`, 'public','kbirStage5')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            //console.log("inside filename",req.body.mandatoryDocuments[0].fileName)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            // req.body.mandatoryDocuments=[];
            // req.body.mandatoryDocuments.push(name)
            return cb(null, name)
        }
    })
}
export const UploadMajorDocs = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            //console.log("inside mor upload",req.body)
            const uploadPath = join(__dirname, `../`, 'public','majorChangeControl')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            //console.log("inside filename",req.body.mandatoryDocuments[0].fileName)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            // req.body.mandatoryDocuments=[];
            // req.body.mandatoryDocuments.push(name)
            return cb(null, name)
        }
    })
}
export const UploadNonMajorDocs = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            //console.log("inside mor upload",req.body)
            const uploadPath = join(__dirname, `../`, 'public','nonMajorChangeControl')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            //console.log("inside filename",req.body.mandatoryDocuments[0].fileName)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            // req.body.mandatoryDocuments=[];
            // req.body.mandatoryDocuments.push(name)
            return cb(null, name)
        }
    })
}
export const UploadNonMandatoryDocs = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            console.log("inside mor upload",req.body)
            const uploadPath = join(__dirname, `../`, 'public','nmor')
            // console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            //console.log("inside filename",req.body.mandatoryDocuments[0].fileName)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            req.body.mandatoryDocuments = name;
            return cb(null, name)
        }
    })
}

export const UploadUserImage = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            console.log(req.body)
            const uploadPath = join(__dirname, `../`, 'public')
            console.log(uploadPath)
            if (!existsSync(uploadPath)) {
                console.log(uploadPath)
                mkdirSync(uploadPath, { recursive: true });
            }
            return cb(null, uploadPath)
        },
        filename: (req, file, cb) => {
            console.log(file)
            const timestamp = new Date().toISOString().replace(/[-:.]/g, "");
            const random = ("" + Math.random()).substring(2, 8);
            const random_number = timestamp + random;
            const name = random_number + '-' + file.originalname;
            req.body.picture = name;
            return cb(null, name)
        }
    })
}