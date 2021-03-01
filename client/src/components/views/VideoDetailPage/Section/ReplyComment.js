import React, { useEffect, useState } from 'react'
import SingleComment from './SingleComment'

function ReplyComment(props) {

    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)

    useEffect(() => {
        let commentNumber = 0
        props.commentLists.map((comment)=>{
            if(comment.responseTo === props.parentCommentId){
                commentNumber++
            }
        })

        setChildCommentNumber(commentNumber)
    }, [props.CommentLists, props.parentCommentId])

    let renderReplyComment=(parentCommentId)=>{
        for (let i=0;i<8;i++){
            if (props.commentLists[i].responseTo === parentCommentId){
                console.log(props.commentLists[i].content)
            }
        }
        
        props.commentLists.map((comment,index)=>(
                       
            (comment.responseTo === parentCommentId && 
                <React.Fragment>
                    <div style={{ width: '80%', marginLeft: '40px' }}>
                        <SingleComment comment={comment} postId={props.videoId} refreshFunction={props.refreshFunction} />
                        <ReplyComment CommentLists={props.CommentLists} parentCommentId={comment._id} postId={props.videoId} refreshFunction={props.refreshFunction} />
                    </div>
                </React.Fragment>
            )
        ))
        
    }

    const onHandleChange=()=>{
        setOpenReplyComments(!OpenReplyComments)
    }
    return (
        <div>
            {ChildCommentNumber >0 &&
                <p style={{fontSize:'14px', margin:0, color:'gray'}} onClick={onHandleChange}>
                    View {ChildCommentNumber} more comment(s)
                </p>

            }  

            {OpenReplyComments &&
                renderReplyComment(props.parentCommentId)
            }
             
        </div>
    )
}

export default ReplyComment
