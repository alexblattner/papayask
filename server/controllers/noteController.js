const Question = require("../models/question");
const Note = require("../models/note");


exports.edit= async (req, res, next) => {
  const note= await Note.findById(req.body.id).exec();
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
  console.log(req.body);
  const question = await Question.findById(req.body.questionId).exec();
  if (!question) return res.sendStatus(404)
  if (question.receiver._id.toString() == req.user._id.toString()) {
    let content= Array.isArray(req.body.content) ? req.body.content[0] : req.body.content;
    let submission={
      user: req.user._id,
      question: req.body.questionId,
      content: content,
    }
    if(req.body.coordinates) submission.coordinates=req.body.coordinates;
    await Note.create(submission)
      .then(async(data) => {
        if(!question.status||!question.status.action||question.status.action=="pending"){
          if(question.status){
            question.status.action="accepted";
          }else{
            question.status={action:"accepted",done:false,reason:""};
          }
        }
        question.notes.push(data._id);
        await question.save();
        return res.send(data);
      })
  } else {
    return res.sendStatus(403);
  }
}
