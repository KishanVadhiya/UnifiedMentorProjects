const drive = require('../config/drive.config.js');

const createFolderIfDontExists = async (jobId)=>{
    const folderQuery = `name='${jobId}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
        
        const { data: { files: existingFolders } } = await drive.files.list({
            q: folderQuery,
            fields: 'files(id)',
        });

        if (existingFolders.length > 0) {
            return existingFolders[0].id;
        } else {
            const { data: newFolder } = await drive.files.create({
                resource: {
                    name: jobId,
                    mimeType: 'application/vnd.google-apps.folder',
                },
                fields: 'id',
            });
            return newFolder.id;
        }
}

module.exports=createFolderIfDontExists;