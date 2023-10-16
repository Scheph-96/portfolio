let Enum = require('enum');

const ProjectType = Enum({NEW: 'NEW', ONGOING: 'ONGOING', ABORTED: 'ABORTED', COMPLETED: 'COMPLETED'});

export {
    ProjectType
}