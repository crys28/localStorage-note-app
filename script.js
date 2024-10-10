console.log(localStorage)

if(localStorage.length == 0){
    localStorage.setItem("openCollection", JSON.stringify("Home"))
    localStorage.setItem("collectionList", JSON.stringify(["Home"]))
    localStorage.setItem("appColor", JSON.stringify(
        {
            "drawer" : "#008b8b",
            "topside" : "#FFFFFF",
            "noteGrid" : "#FFFFFF",
            "textCol" : "#000000",
        }
    ))
    // localStorage.setItem("collectionList", JSON.stringify(["Home"]))
    setTimeout(() => {
        
        openCollection()
        renderCollections()
        renderNotes()
        colorApp()
    }, 200);
}

// localStorage.setItem("openCollection", JSON.stringify("Home"))

const colorApp = () => {
    const appColor = JSON.parse(localStorage.getItem("appColor"))

    const leftPanel = document.getElementById("leftPanel");
    const topside = document.getElementById("topside");
    const noteGrid = document.getElementById("noteGrid");
    const mainFrame = document.getElementById("mainFrame");

    leftPanel.style.backgroundColor = appColor.drawer
    topside.style.backgroundColor = appColor.topside
    noteGrid.style.backgroundColor = appColor.noteGrid
    mainFrame.style.color = appColor.textCol
}
colorApp()

const openCollection = () =>{
    const collectionName = document.getElementById("collectionName")
    collectionName.textContent = JSON.parse(localStorage.getItem("openCollection"))
}
openCollection()


// RENDER NOTES - this function is responsible for rendering dynamically the notes on the web page.
const renderNotes = () =>{
    const noteGrid = document.getElementById("noteGrid")
    noteGrid.innerHTML = ""
    const collectionTitle = document.getElementById("collectionName").innerText

    for(let i = 0; i<localStorage.length;i++){

        if(localStorage.key(i) != "openCollection" && localStorage.key(i) != "collectionList" && localStorage.key(i) != "appColor"){
            if(JSON.parse(localStorage.getItem(localStorage.key(i))).collection == collectionTitle){

                const div = document.createElement('div');
                div.classList.add("noteItem")
                const imgEdit = document.createElement('img');
                imgEdit.src = "./pics/edit.png";
                imgEdit.width = "34"
                imgEdit.height = "34"
                imgEdit.addEventListener("click", () =>{
                    editNote(JSON.parse(localStorage.getItem(localStorage.key(i))).title, JSON.parse(localStorage.getItem(localStorage.key(i))).content, JSON.parse(localStorage.getItem(localStorage.key(i))).id)
                    
                })
                const imgDelete = document.createElement('img');
                imgDelete.src = "./pics/delete.png";
                imgDelete.width = "34"
                imgDelete.height = "34"
                imgDelete.addEventListener("click", () =>{
                    if(confirm("Are you sure you want to delete the note ?")){
                        localStorage.removeItem(localStorage.key(i));
                        renderNotes()
                    }
                })
                const span = document.createElement('span');
                span.innerText = JSON.parse(localStorage.getItem(localStorage.key(i))).date;
                const h3 = document.createElement('h3');
                h3.innerText = JSON.parse(localStorage.getItem(localStorage.key(i))).title;
                const p = document.createElement('p');
                p.innerText = JSON.parse(localStorage.getItem(localStorage.key(i))).content;
        
                div.append(imgEdit)
                div.append(imgDelete)
                div.append(span)
                div.append(h3)
                div.append(p)
        
                noteGrid.append(div)
            }
        }else{
            continue;
        }
    }
}
renderNotes()

//Switch Dialog - This function is responsible for the opening or closing the dialog window for creating a new note or editing an existing one.
const switchDialog = (title, content) =>{
    const dialog = document.getElementById("diag")
    const dialogState = dialog.getAttribute("open")

    const noteGrid = document.getElementById("noteGrid")
    const bgDrop = document.getElementById("bgDrop")
    if(!dialogState){
        dialog.setAttribute("open", "true")
        noteGrid.classList.add("blurGrid")
        noteGrid.style.pointerEvents = "none"
        document.getElementById("noteTitle").value = title
        document.getElementById("noteContent").value = content

        const bottomBarDialog = document.getElementById("bottomBarDialog")

        const saveBtn = document.createElement("button")
        saveBtn.textContent = "Save"
        saveBtn.id = "saveBtn"
        saveBtn.addEventListener("click", saveNote)
        bottomBarDialog.prepend(saveBtn)

        bgDrop.style.zIndex = "0"
    }else{
        dialog.removeAttribute("open")
        noteGrid.classList.remove("blurGrid")
        noteGrid.style.pointerEvents = "all"
        noteTitle = noteContent = ""
        bgDrop.style.zIndex = "-500"
        
        const saveBtn = document.getElementById("saveBtn");
        saveBtn.remove()
    }
}

//This function represents the functionality of the 'Save' button when creating a new note.
const saveNote = () =>{
    const noteTitle = document.getElementById("noteTitle").value
    const noteContent = document.getElementById("noteContent").value
    
    set_update_note(noteTitle, noteContent, "")
}

//This function represents the functionality of the 'Edit' button when editing an existing note.
const editNote = (title, content, noteId) => {
    switchDialog(title, content);
    const saveBtn = document.getElementById("saveBtn");
    saveBtn.removeEventListener("click", saveNote)
    saveBtn.textContent = "Edit"
    saveBtn.addEventListener("click", ()=>{
        const noteTitle = document.getElementById("noteTitle").value
        const noteContent = document.getElementById("noteContent").value
        set_update_note(noteTitle, noteContent, noteId)
    })
}

//This function is called by both the save and edit button and executes coresponding behaviour. 
const set_update_note = (noteTitle, noteContent, noteId) =>{
    const collectionName = document.getElementById("collectionName").innerText
    if(noteTitle != "" && noteContent != ""){
        localStorage.setItem(noteId != "" ? noteId : Date.now(), JSON.stringify(
            {   
                "id": noteId != "" ? noteId : Date.now(),
                "title": noteTitle,
                "content": noteContent,
                "collection": collectionName,
                "date": `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
            }
        ))
        noteId != "" ? alert("Note updated succesfully") : alert("Note saved succesfully")
        switchDialog("","")
        renderNotes()
    }else{
        alert("Fill in the blanks !!!")        
    }
}

// RENDER Collections - this function is responsible for rendering dynamically the list of collections on the left panel.
const renderCollections = () =>{
    const collectionList = document.getElementById("collectionList")
    collectionList.innerHTML = ""
    
    const collectionList_Storage = JSON.parse(localStorage.getItem("collectionList"))
    for(let i = 0; i< collectionList_Storage.length; i++){
        const span = document.createElement('span');
        span.innerText = collectionList_Storage[i];
        span.addEventListener("click", ()=>{
            localStorage.setItem("openCollection", JSON.stringify(collectionList_Storage[i]))
            openCollection()
            renderNotes()
        })
        const div = document.createElement("div");
        const editImg = document.createElement("img")
        editImg.src = "./pics/edit.png"
        editImg.width = "30"
        editImg.height = "30"
        editImg.addEventListener("click", ()=>{
            renameCollection(collectionList_Storage[i])
        })
        div.append(editImg)
        const deleteImg = document.createElement("img")
        deleteImg.src = "./pics/delete.png"
        deleteImg.width = "30"
        deleteImg.height = "30"
        deleteImg.addEventListener("click", () =>{
            if(confirm(`Are you sure you want to delete the '${collectionList_Storage[i]}' collection ?`)){
                deleteCollection(i, collectionList_Storage[i])
            }
        })
        div.append(deleteImg)

        span.append(div)
        collectionList.append(span)
    }
}
renderCollections()

//Switch Collection Dialog - This function is responsible for the opening or closing the dialog window for creating a new list or for renaming it.
const switch_collection_dialog = (title) =>{
    const addCollectionForm = document.getElementById("addCollectionForm")
    const dialogState = addCollectionForm.getAttribute("open")
    
    const diagTitle = document.getElementById("diagTitle")
    const collectionInput = document.getElementById("collectionInput")
    const bgDrop = document.getElementById("bgDrop")

    if(!dialogState){
        addCollectionForm.setAttribute("open", "true")
        noteGrid.classList.add("blurGrid")
        noteGrid.style.pointerEvents = "none"

        const bottomBarDialog = document.getElementById("addCollectionBottom")
        const saveBtn = document.createElement("button")
        saveBtn.textContent = "Save"
        saveBtn.id = "saveCollectionBtn"
        saveBtn.addEventListener("click", createCollection)
        bottomBarDialog.prepend(saveBtn)

        if(title == ""){
            diagTitle.innerText = "Create a new collection:"
            collectionInput.value = ""
        }else{
            diagTitle.innerText = "Rename collection"
            collectionInput.value = title
        }
        
        bgDrop.style.zIndex = "0"
    }else{
        addCollectionForm.removeAttribute("open")
        noteGrid.classList.remove("blurGrid")
        noteGrid.style.pointerEvents = "all"

        const leftPanel = document.getElementById("leftPanel");
        if(leftPanel.classList.contains("active")){
            bgDrop.style.zIndex = "0"
        }else{

            bgDrop.style.zIndex = "-500"
        }

        const saveCollectionBtn = document.getElementById("saveCollectionBtn")
        saveCollectionBtn.remove()
    }
}

//Function assigned to 'Save' button when creating a new collection.
const createCollection = () =>{
    set_update_collection('')
}

//Function responsible for renaming a collection
const renameCollection = (title) => {
    switch_collection_dialog(title)
    const saveBtn = document.getElementById("saveCollectionBtn");
        saveBtn.removeEventListener("click", createCollection)
        saveBtn.addEventListener("click", ()=>{
            set_update_collection(title)
        })
}

//Function which deletes a collection and all coresponding notes from it.
const deleteCollection = (i, collectionTitle) => {

    try {
    const collectionArray = JSON.parse(localStorage.getItem('collectionList'))
    collectionArray.splice(i, 1);
    localStorage.setItem("collectionList", JSON.stringify(collectionArray))

     for(let j = 0; j<localStorage.length; j++){
        if(localStorage.key(j) != "openCollection" && localStorage.key(j) != "collectionList"){
            if(JSON.parse(localStorage.getItem(localStorage.key(j))).collection == collectionTitle){
                localStorage.removeItem(localStorage.key(j));
            }
        }
    }

    setTimeout(() => {
        localStorage.setItem("openCollection", JSON.stringify("Home"))
        openCollection()
        renderCollections()
        renderNotes()
    }, 200);
    } catch (err) {
        console.log(err)
    }
    
}

//Function responsible for renaming or creating a new collection.
const set_update_collection = (title) =>{
    const collectionInput = document.getElementById("collectionInput").value
    if(collectionInput != ""){

        const collectionArray = JSON.parse(localStorage.getItem('collectionList'))
        try {
            if(title != ""){
                for(let i = 0; i<collectionArray.length; i++){
                    if(collectionArray[i] == title){
                        collectionArray[i] = collectionInput;
                        localStorage.setItem("collectionList", JSON.stringify(collectionArray))
                    }
                }
            }else{
                collectionArray.push(collectionInput)
                localStorage.setItem("collectionList", JSON.stringify(collectionArray))
            }

            switch_collection_dialog("")
            renderCollections()
        } catch (err) {
            console.log(err)
        }
    }else{
        alert("Fill in the blanks !!!")        
    }
}

//This function opens the drawer when in mobile view.
const openDrawer = () =>{
    const leftPanel = document.getElementById("leftPanel");
    const bgDrop = document.getElementById("bgDrop")
    leftPanel.classList.toggle("active")
     bgDrop.style.zIndex = "0"
}

//This function allows closing the drawer or any other popup by clicking outside of it.
const onMouseOutCloseModal = ()=>{
    const addCollectionForm = document.getElementById("addCollectionForm").getAttribute("open")
    const dialog = document.getElementById("diag").getAttribute("open")
    const colorForm = document.getElementById("colorForm").getAttribute("open")

    const leftPanel = document.getElementById("leftPanel");
    const bgDrop = document.getElementById("bgDrop")

    if(addCollectionForm){
        switch_collection_dialog("")     
    }else if(dialog){
        switchDialog('','')
    }else if(leftPanel.classList.contains("active")){
        bgDrop.style.zIndex = "-500"
        leftPanel.classList.toggle("active")
    }else if(colorForm){
        switchColorDialog()
    }
}

//This function is responsible for saving any new color changes.
const setColor = () =>{
    const drawerColor = document.getElementById("drawerColor")
    const navColor = document.getElementById("navColor")
    const notegridColor = document.getElementById("notegridColor")
    const textColor = document.getElementById("textColor")

    const appColor = JSON.parse(localStorage.getItem("appColor"))
    
    appColor.drawer = drawerColor.value
    appColor.topside = navColor.value
    appColor.noteGrid = notegridColor.value
    appColor.textCol = textColor.value

    localStorage.setItem("appColor", JSON.stringify(appColor))

    colorApp()
}

//This function resets the colors to their default values.
const resetColor = () =>{
    document.getElementById("drawerColor").value = "#008b8b"
    document.getElementById("navColor").value = "#FFFFFF"
    document.getElementById("notegridColor").value = "#FFFFFF"
    document.getElementById("textColor").value = "#000000"
}

//This function toggles the changing color dialog.
const switchColorDialog = () =>{
    const colorForm = document.getElementById("colorForm")
    const dialogState = colorForm.getAttribute("open")

    const appColor = JSON.parse(localStorage.getItem("appColor"))

    const noteGrid = document.getElementById("noteGrid")
    const bgDrop = document.getElementById("bgDrop")
    if(!dialogState){
        colorForm.setAttribute("open", "true")
        noteGrid.classList.add("blurGrid")
        noteGrid.style.pointerEvents = "none"

        document.getElementById("drawerColor").value = appColor.drawer
        document.getElementById("navColor").value = appColor.topside
        document.getElementById("notegridColor").value = appColor.noteGrid
        document.getElementById("textColor").value = appColor.textCol
       
        bgDrop.style.zIndex = "0"
    }else{
        colorForm.removeAttribute("open")
        noteGrid.classList.remove("blurGrid")
        noteGrid.style.pointerEvents = "all"

        const leftPanel = document.getElementById("leftPanel");
        if(leftPanel.classList.contains("active")){
            bgDrop.style.zIndex = "0"
        }else{
            bgDrop.style.zIndex = "-500"
        }
    }
}