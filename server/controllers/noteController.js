const Question = require("../models/question");
const Note = require("../models/note");
const { log } = require("console");


exports.edit= async (req, res, next) => {
  const note= await Note.findOne({_id:req.body.id,user:req.user._id}).exec();
  if (note && note.user.toString() == req.user._id.toString()) {
    await note.update({ content: req.body.content });
    return res.send(note);
  } else {
    return res.sendStatus(403);
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Note.findByIdAndRemove(req.params.id);
    return res.send(deleted);
  } catch (e) {
    console.log(e.message);
  }
};


exports.create= async (req, res, next) => {
  const question = await Question.findById(req.body.questionId).exec();
  if (!question) return res.sendStatus(404)
  if (question.receiver._id.toString() == req.user._id.toString()) {
    let content= Array.isArray(req.body.content) ? req.body.content[0] : req.body.content;
    let submission={
      user: req.user._id,
      question: req.body.questionId,
      content: content,
      type: req.body.type,
    }
    if(req.body.coordinates) submission.coordinates=req.body.coordinates;
    if(question.status?.done!=true){
      await Note.create(submission).then(async(data) => {
        console.log(333333333,data);
        if(!question.status||!question.status.action||question.status.action=="pending"){//notifies that the question has been accepted
          if(question.status){
            question.status.action="accepted";
          }else{
            question.status={action:"accepted",done:false,reason:""};
          }
        }
        question.notes.push(data._id);
        if(req.body.type=="answer"){
          question.status.done=true;
          question.markModified('status');
        }else if(req.body.type=="refusal"){
          question.status.done=true;
          question.status.action="rejected";
          question.status.reason=req.body.content;
          question.markModified('status');
        }
        await question.save();
        const finaldata=data;
        finaldata.user=req.user;
        return res.send(finaldata);
      })
    }
  } else if(question.sender._id.toString() == req.user._id.toString()){
    let submission={
      user: req.user._id,
      question: req.body.questionId,
      content: req.body.content,
      type: req.body.type,
    }
    const preNotes= await Note.find({question:req.body.questionId}).sort('createdAt').exec();
    if(!(preNotes.length>0&&preNotes[preNotes.length-1].user.toString()==req.user._id.toString())){
      if(req.body.coordinates) submission.coordinates=req.body.coordinates;
      await Note.create(submission).then(async(data) => {
        question.notes.push(data._id);
        await question.save();
        const finaldata=data;
        finaldata.user=req.user;
        return res.send(finaldata);
      })
    }
  }else {
    return res.sendStatus(403);
  }
}
