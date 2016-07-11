
var chatHistory = document.getElementById("chatHistory"),
    contacts = document.getElementById("contacts"),
    contactsItem = document.getElementsByClassName("contactsItem"),
    addContact = document.getElementById("addContact");

function contactsItemClick()
{
    alert(this.className);
}
for (var i = 0; i < contactsItem.length; i++)
{
    contactsItem[i].addEventListener('click', contactsItemClick, false);
}

addContact.addEventListener("click", function()
{
    html = "<div class='dynamicHtml'>" +
        "<p>Name:<input type='text'></p>" +
        "<p>Lastname:<input type='text'></p>" +
        "<p>Ring ID:<input type='text'></p></div>";

    swal({
        title: 'New Contact',
        html: html,
        showCancelButton: true,
        confirmButtonText: 'Submit',
        showLoaderOnConfirm: true,
        preConfirm: function()
        {
            swal(
                'Added!',
                'New contact has been added.',
                'success'
            )
        }
    }).then(function() {})
});

