var db = firebase.database()
firebase.on("value", function(){
    console.log(snapshot.val())
})