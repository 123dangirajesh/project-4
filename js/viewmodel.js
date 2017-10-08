//      View Model for the app       //


var ViewModel = function() {
  var self = this;

  
  // position constructor to be used to set positions to the list view as well as for markers //

    
  var position = function(data) {
    this.title = data.title;
    this.marker = data.marker;
    this.visible = ko.observable(true);
  };

  self.positionList = ko.observableArray([]);


 
  // Push all positions to an array - positionList     //
  
  
  positions.forEach(function(positionItem) {
    self.positionList.push(new position(positionItem));
  });


  
  // Filter list items corresponding markers according to input //
  
  
  this.searchTerm = ko.observable("");
  self.filteredList = ko.computed(function() {
		var filter = self.searchTerm().toLowerCase();
      
		if (!filter) {
			self.positionList().forEach(function(positionItem){
				if (positionItem.marker) {
                    positionItem.visible(true);
                    positionItem.marker.setVisible(true);
                }
			});
			return self.positionList();
		} else {
			return ko.utils.arrayFilter(self.positionList(), function(positionItem) {
				var string = positionItem.title.toLowerCase();
				var result = (string.search(filter) >= 0);
				positionItem.visible(result);
                positionItem.marker.setVisible(result);
				return result;
			});
		}
	}, self);

  //  Initiate google event to open infoWindow when list item is clicked //
    
  self.openWindow = function(place) {
    google.maps.event.trigger(place.marker, 'click');
  };

}; // View Model end Store ViewModel in ViewModal variable for instantiation in app.js //

var ViewModal = new ViewModel();
