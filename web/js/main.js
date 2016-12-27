$(document).ready(function() {

    var flickr = {
        init: function() {
            this.apiKey = '52919acfd3949ab92b4b6dc969cfd118';
            this.baseUrl = 'https://api.flickr.com/services/rest';
        },

        search: function(tags, callback) {
            $.get(this.baseUrl + '/?' + $.param({
                api_key: this.apiKey,
                method: "flickr.photos.search",
                tags: tags.join(','),
                format: "json",
                nojsoncallback: 1,
                per_page: 12,
                page: controller.getCurrentPage(),
                sort: "relevance"
            }), callback);
        },

        getInfo: function(photo, callback) {
            $.get(this.baseUrl + '/?' + $.param({
                api_key: this.apiKey,
                method: "flickr.photos.getInfo",
                format: "json",
                nojsoncallback: 1,
                photo_id: photo.id
            }), callback);
        },

        buildPhotoUrlThumb: function(photo) {
            return this.buildPhotoUrl(photo, 'q');
        },

        buildPhotoUrlLarge: function(photo) {
            return this.buildPhotoUrl(photo, 'z');
        },

        buildPhotoUrl: function(photo, size) {
            return 'https://farm' + photo.farm + '.staticflickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_' + size + '.jpg';
        }
    };

    var model = {
        photos: [],
        currentPage: 1,
        currentPhoto: null
    };

    var controller = (function() {
        return {
            init: function() {
                thumbnailView.init();
                singleImageView.init();
                this.loadPage();
            },

            loadPage: function() {
                thumbnailView.clear();

                flickr.search(tags, function(data) {
                    model.photos = data.photos.photo;

                    thumbnailView.render();
                });
            },

            loadNextPage: function() {
                ++model.currentPage;
                this.loadPage();
            },

            loadPrevPage: function() {
                if (model.currentPage > 1) {
                    --model.currentPage;
                    this.loadPage();
                }
            },

            thumbnailClicked: function(index) {
                model.currentPhoto = model.photos[index];
                flickr.getInfo(model.currentPhoto, function(data) {
                    singleImageView.renderInfo(data.photo);
                });

                this.displaySingleImageView();
            },

            displayThumbnailView: function() {
                singleImageView.hide();
                thumbnailView.render();
            },

            displaySingleImageView: function() {
                thumbnailView.hide();
                singleImageView.render();
            },

            getPhotos: function() {
                return model.photos;
            },

            getCurrentPage: function() {
                return model.currentPage
            },

            getCurrentPhoto: function() {
                return model.currentPhoto;
            }
        };
    })();

    var thumbnailView = {
        init: function () {
            this.$mainDisplay1 = $('#main-display-1');
            this.$images = this.$mainDisplay1.find('img');
            this.$prevPageBtn = $('#prev-page-btn')
            this.$nextPageBtn = $('#next-page-btn');
            this.attachEventListener();
        },

        hide: function() {
            this.$mainDisplay1.hide();
        },

        clear: function() {
            this.$images.each(function(index, image) {
                $(image).attr('src', $(image).attr('data-default-src'));
            });
        },

        render: function() {
            this.$mainDisplay1.show();
            this.$images.each(function(index, image) {
                var photo = controller.getPhotos()[index];
                $(image).attr('src', flickr.buildPhotoUrlThumb(photo));
            });
        },

        attachEventListener: function() {
            this.$images.each(function(index, image) {
                $(image).parent().click(function() {
                    controller.thumbnailClicked(index);
                });
            });

            this.$nextPageBtn.click(function() {
                controller.loadNextPage();
            });

            this.$prevPageBtn.click(function() {
                controller.loadPrevPage();
            });
        }
    };

    var singleImageView = {
        init: function() {
            this.$mainDisplay2 = $('#main-display-2');
            this.$image = this.$mainDisplay2.find('img');
            this.$backBtn = $('#back-btn');
            this.$photoTitle = $('#photo-title');
            this.$photoDesc = $('#photo-desc');
            this.attachEventHandlers();

            this.hide();
        },

        hide: function() {
            this.$mainDisplay2.hide();
            this.$photoTitle.text('');
            this.$photoDesc.html('');
        },

        render: function() {
            var url = flickr.buildPhotoUrlLarge(controller.getCurrentPhoto());
            this.$image.attr('src', '');
            this.$image.attr('src', url);
            this.$mainDisplay2.show();
        },

        renderInfo: function(photo) {
            var date = new Date(photo.dateuploaded * 1000);
            this.$photoTitle.html(photo.title._content + '<br><small>' + date.toLocaleDateString('en-AU') + '</small>');
            this.$photoDesc.html(photo.description._content || "No description.");
        },

        attachEventHandlers: function() {
            this.$backBtn.click(function() {
                controller.displayThumbnailView();
            });
        }
    };

    flickr.init();
    controller.init();
});
