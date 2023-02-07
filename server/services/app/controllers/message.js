const {Chat} = require("../mongo/db/models").models;

class Controller {
     static getMessageHistory = async(req,res) => {
        const {from,to} = req.params;
        try {
            let getMsg;
            getMsg = await Chat.findOne({$or: [{fromUserId:+from,toUserId:+to},{fromUserId:+to,toUserId:+from}]});
            // if(!getMsg) getMsg = await Chat.findOne({fromUserId:+to,toUserId:+from});
            // const fromMessage = await Chat.findOne({fromUserId:+from, toUserId:+to})
            if(!getMsg) throw {name:"Not found"}
            // const toMessage = await Chat.findOne({fromUserId:to, toUserId:from})
            res.status(200).json(getMsg);
            // res.status(200).json({from:fromMessage, to:toMessage})
        } catch(error) {
            if(error.name === "Not found") res.status(404).json({message:error.name})
            else res.status(500).json({message:"Internal server error"})
        }
     }

     static postMessage = async(req,res) => {
        const {from,to,message} = req.body;
        try {
            const datess = new Date()
            const adding = {sender:+from,message, created:datess}
            let addMsg;
            addMsg = await Chat.findOne({$or: [{fromUserId:+from,toUserId:+to},{fromUserId:+to,toUserId:+from}]});
            const room = from*to + "room";
            // if(!addMsg) addMsg = await Chat.findOne({fromUserId:+to,toUserId:+from});
            // addMsg = await Chat.findOneAndUpdate({fromUserId:+from,toUserId:+to}, {$push: {message:adding}})
            if(!addMsg) {
                addMsg = await Chat.create({fromUserId:+from,toUserId:+to,message:[adding],roomId:room})
            } else {
                addMsg.message.push(adding)
                const check = await addMsg.save()
            }
            res.status(201).json(addMsg)
        } catch (error) {
            if(error.name === "ValidationError") res.status(400).json({message:"Input is invalid"})
            else res.status(500).json({message:"Internal server error"})
        }
     }

     static getAllUserRelatedToSender = async(req,res) => {
        const from = req.params.fromId;
        try {
            let allUsers;
            allUsers = await Chat.find({$or: [{fromUserId:+from},{toUserId:+from}]});
            if(!allUsers || allUsers.length === 0) throw {name:"Not found"}
            res.status(200).json(allUsers);
        } catch (error) {
            if(error.name === "Not found") res.status(404).json({message:error.name})
            else res.status(500).json({message:"Internal server error"})
        }
     }
}

module.exports = Controller;