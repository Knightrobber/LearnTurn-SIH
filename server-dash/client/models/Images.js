import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

const Images = new FilesCollection({
  collectionName: 'Images'
});

export default Images;