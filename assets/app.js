
/**
 *  A single card to show.
 */
var Card = function (data)
{
    this.eng = function () {
        return data.eng;
    };

    this.nl = function () {
        return data.nl;
    };
}

/**
 *  A collection of cards
 */
var Cards = function (data) {

    /**
     *  Get random card.
     *
     *  @return Card
     */
    this.random = function () {

        return new Card(data[Math.floor(Math.random() * data.length)]);
    };
};

var App = function () {

    /**
     *  The card model
     */
    var CardModel = function (card) {

        // assign the elem
        this.elem = template('card');

        // assign data to the elem
        this.elem.querySelector('.original').textContent = card.eng();
        this.elem.querySelector('.translation').textContent = card.nl();
    };

    /**
     *  Get the data.
     *
     *  @return Promise
     */
    var fetchData = function () {

        // return the promise
        return new Promise(function (resolve, reject) {

            // create XHR object that we can use to get the data
            var dataXhr = new XMLHttpRequest();

            // install load event handling
            dataXhr.addEventListener('load', function (event) {

                // resolve with the XHR object
                resolve(event.target);
            });

            // install error handler
            dataXhr.addEventListener('error',  function (event) {

                // reject the promise
                reject();
            });

            // make the connection
            dataXhr.open("GET", "data/netherlands.json");
            dataXhr.send();
        });
    };

    var cards;

    // fetch the data
    fetchData()
        .then(function (val) {

            // construct the cards
            cards = new Cards(JSON.parse(val.responseText));

            // when data is there we can make handling for the button
            document.querySelector('.next-card').addEventListener('click', function () {

                nextCard();
            });
        })
        .catch(function () { console.log('error'); });

    // the templates
    var templates = { };

    // load all templates into a special object
    var loadTemplates = function () {

        // get all templates
        var templatesElem = document.querySelector('#templates');

        // iterate over the templates
        for (var idx = 0; idx < templatesElem.children.length; ++idx) {

            // get the element
            var elem = templatesElem.children[idx];

            // detach the element
            templatesElem.removeChild(elem);

            // skip if we don't have template name
            if (!elem.dataset.template) continue;

            // assign the template to a variable
            templates[elem.dataset.template] = elem;
        }
    };

    // load templates
    loadTemplates();

    /**
     *  Get a copy of template element that can be used for models.
     */
    var template = function (what) {

        // do we have a template
        if (!templates[what]) return null;

        // return a cloned element
        return templates[what].cloneNode(true);
    };

    var createCard = function (data) {

        return new CardModel(data);
    };

    /**
     *  Show the next card.
     */
    var nextCard = function () {

        // get the card holder element
        var cardHolder = document.querySelector('.card-holder');

        // empty the card holder element
        for (var idx = 0; idx < cardHolder.children.length; ++idx)
            cardHolder.removeChild(cardHolder.children[idx]);

        // append card model to card holder
        cardHolder.appendChild(createCard(cards.random()).elem);
    };
};

// await the loaded content
document.addEventListener('DOMContentLoaded', function (event) {

    // create the application
    var app = new App;
});
