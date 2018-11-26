// Userlist data array for filling in info box
var countryListData = [];

// DOM Ready =============================================================
$(document).ready(function() {

    // Populate the user table on initial page load
    populateTable();
    $('#countryList table tbody').on('click', 'td a.linkshowcountry', showCountryInfo);
    $('#btnAddCountry').on('click', addCountry);
    $('#countryList table tbody').on('click', 'td a.linkdeletecountry', deleteCountry);
});

// Functions =============================================================

// Fill table with data
function populateTable() {

    // Empty content string
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON( '/countries/countrylist', function( data ) {

        countryListData = data;
        // For each item in our JSON, add a table row and cells to the content string
        $.each(data, function(){
            tableContent += '<tr>';
            tableContent += '<td><a href="#" class="linkshowcountry" rel="' + this.name + '">' + this.name + '</a></td>';
            tableContent += '<td>' + this.code + '</td>';
            tableContent += '<td><a href="#" class="linkdeletecountry" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        // Inject the whole content string into our existing HTML table
        $('#countryList table tbody').html(tableContent);
    });
};

// Show Country Info
function showCountryInfo(event) {

    // Prevent Link from Firing
    event.preventDefault();

    // Retrieve username from link rel attribute
    var thisUserName = $(this).attr('rel');

    // Get Index of object based on id value
    var arrayPosition = countryListData.map(function(arrayItem) { return arrayItem.name; }).indexOf(thisUserName);
    var thisCountryObject = countryListData[arrayPosition];

    //Populate Info Box
    $('#countryInfoName').text(thisCountryObject.name);
    $('#countryInfoRegion ').text(thisCountryObject.code);
    $('#countryInfoPopulation').text(thisCountryObject.population);

};

// Add User
function addCountry(event) {
    event.preventDefault();

    // Super basic validation - increase errorCount variable if any fields are blank
    var errorCount = 0;
    $('#addCountry fieldset input').each(function(index, val) {
        if($(this).val() === '') { errorCount++; }
    });

    // Check and make sure errorCount's still at zero
    if(errorCount === 0) {

        // If it is, compile all user info into one object
        var newCountry = {
            'name'  : $('#addCountry input#inputCountryName').val(),
            'region': $('#addCountry input#inputCountryRegion').val(),
            'population': $('#addCountry input#inputCountryPopulation').val(),
        }

        // Use AJAX to post the object to our adduser service
        $.ajax({
            type: 'POST',
            data: newCountry,
            url: '/countries/addcountry',
            dataType: 'JSON'
        }).done(function( response ) {

            // Check for successful (blank) response
            if (response.status === 200) {

                // Clear the form inputs
                $('#addCountry fieldset input').val('');

                // // Update the table
                // populateTable();

            }
            else {

                // If something goes wrong, alert the error message that our service returned
                alert('Error: ' + response.msg);

            }
        });
    }
    else {
        // If errorCount is more than 0, error out
        alert('Please fill in all fields');
        return false;
    }
};

// Delete User
function deleteCountry(event) {

    event.preventDefault();

    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this country?');

    // Check and make sure the user confirmed
    if (confirmation === true) {

        // If they did, do our delete
        $.ajax({
            type: 'DELETE',
            url: '/countries/deletecountry/' + $(this).attr('rel')
        }).done(function( response ) {

            // Check for a successful (blank) response
            if (response.msg === '') {
            }
            else {
                alert('Error: ' + response.msg);
            }

            // Update the table
            populateTable();

        });

    }
    else {

        // If they said no to the confirm, do nothing
        return false;

    }

};