/* eslint-disable max-lines */
/* eslint-disable max-len */
/** @namespace Seedsman/Util/Widget/Index/reviewWidget */
export function reviewWidget(sku) {
    return `new ReviewsWidget('#ReviewsWidget', {
        //Your REVIEWS.io Store ID and widget type:
        store: 'seedsman-com',
        widget: 'polaris',

        //Content settings (store_review,product_review,third_party_review,questions). Choose what to display in this widget:
        options: {
            types: 'product_review',
            lang: 'en',
            //Possible layout options: bordered, large and reverse.
            layout: '',
            //How many reviews & questions to show per page?
            per_page: 3,
            store_review:{
              hide_if_no_results: false,
            },
            third_party_review:{
              hide_if_no_results: false,
            },
            //Product specific settings. Provide product SKU for which reviews should be displayed:
            product_review:{
                //Display product reviews - include multiple product SKUs seperated by Semi-Colons (Main Indentifer in your product catalog )
                sku: '${sku}',
                hide_if_no_results: false,
            },
            //Questions settings:
            questions:{
                hide_if_no_results: false,
                enable_ask_question: true,
                show_dates: false,
                //Display group questions by providing a grouping variable, new questions will be assigned to this group.
                grouping:'[Group questions by providing a grouping variable here or a specific product SKU]'
            },
            //Header settings:
            header:{
                enable_summary: true, //Show overall rating & review count
                enable_ratings: true,
                enable_attributes: false,
                enable_image_gallery: true, //Show photo & video gallery
                enable_percent_recommended: false, //Show what percentage of reviewers recommend it
                enable_write_review: false, //Show "Write Review" button
                enable_ask_question: false, //Show "Ask Question" button
                enable_sub_header: true, //Show subheader
                rating_decimal_places: 2,
            },

            //Filtering settings:
            filtering:{
                enable: true, //Show filtering options
                enable_text_search: true, //Show search field
                enable_sorting: true, //Show sorting options (most recent, most popular)
                enable_product_filter: false, //Show product options filter
                enable_media_filter: false, //Show reviews with images/video/media options
                enable_overall_rating_filter: true, //Show overall rating breakdown filter
                enable_language_filter: false, // Filter by review language
                enable_language_filter_language_change: false, // Update widget language based on language selected
                enable_ratings_filters: true, //Show product attributes filter
                enable_attributes_filters: true, //Show author attributes filter
            },

            //Review settings:
            reviews:{
                default_sort: 'highest_rating',
                enable_avatar: true, //Show author avatar
                enable_reviewer_name:  true, //Show author name
                enable_reviewer_address:  false, //Show author location
                reviewer_address_format: 'city, country', //Author location display format
                enable_verified_badge: true, //Show "Verified Customer" badge
                review_content_filter: 'undefined', //Filter content
                enable_reviewer_recommends: false, //Show "I recommend it" badge
                enable_attributes: true, //Show author attributes
                enable_product_name: true, //Show display product name
                enable_review_title: undefined, //Show review title
                enable_replies: undefined, //Show review replies
                enable_images: true, //Show display review photos
                enable_ratings: false, //Show product attributes (additional ratings)
                enable_share: true, //Show share buttons
                enable_helpful_vote: false, //Show "was this helpful?" section
                enable_helpful_display: false, //Show how many times times review upvoted
                enable_report: true, //Show report button
                enable_date: true, //Show when review was published
                enable_third_party_source: true, // Show third party source


            },
        },
        //Translation settings
        translations: {
            'Verified Customer': 'Verified Customer'
        },
        //Style settings:
        styles: {
            //Base font size is a reference size for all text elements. When base value gets changed, all TextHeading and TexBody elements get proportionally adjusted.
            '--base-font-size': '16px',

            //Button styles (shared between buttons):
            '--common-button-font-family': 'inherit',
            '--common-button-font-size':'16px',
            '--common-button-font-weight':'500',
            '--common-button-letter-spacing':'0',
            '--common-button-text-transform':'none',
            '--common-button-vertical-padding':'10px',
            '--common-button-horizontal-padding':'20px',
            '--common-button-border-width':'2px',
            '--common-button-border-radius':'0px',

            //Primary button styles:
            '--primary-button-bg-color': '#0E1311',
            '--primary-button-border-color': '#0E1311',
            '--primary-button-text-color': '#ffffff',

            //Secondary button styles:
            '--secondary-button-bg-color': 'transparent',
            '--secondary-button-border-color': '#0E1311',
            '--secondary-button-text-color': '#0E1311',

            //Star styles:
            '--common-star-color': '#0E1311',
            '--common-star-disabled-color': 'rgba(0,0,0,0.25)',
            '--medium-star-size': '22px',
            '--small-star-size': '19px',

            //Heading styles:
            '--heading-text-color': '#0E1311',
            '--heading-text-font-weight': '600',
            '--heading-text-font-family': 'inherit',
            '--heading-text-line-height': '1.4',
            '--heading-text-letter-spacing': '0',
            '--heading-text-transform': 'none',

            //Body text styles:
            '--body-text-color': '#0E1311',
            '--body-text-font-weight': '400',
            '--body-text-font-family': 'inherit',
            '--body-text-line-height': '1.4',
            '--body-text-letter-spacing': '0',
            '--body-text-transform': 'none',

            //Input field styles:
            '--inputfield-text-font-family': 'inherit',
            '--input-text-font-size': '14px',
            '--inputfield-text-font-weight': '400',
            '--inputfield-text-color': '#0E1311',
            '--inputfield-border-color': 'rgba(0,0,0,0.2)',
            '--inputfield-background-color': 'transparent',
            '--inputfield-border-width': '1px',
            '--inputfield-border-radius': '0px',

            '--common-border-color': 'rgba(0,0,0,0.15)',
            '--common-border-width': '1px',
            '--common-sidebar-width': '190px',

            //Slider indicator (for attributes) styles:
            '--slider-indicator-bg-color': 'rgba(0,0,0,0.1)',
            '--slider-indicator-button-color': '#0E1311',
            '--slider-indicator-width': '190px',

            //Badge styles:
            '--badge-icon-color': '#0E1311',
            '--badge-icon-font-size': 'inherit',
            '--badge-text-color': '#0E1311',
            '--badge-text-font-size': 'inherit',
            '--badge-text-letter-spacing': 'inherit',
            '--badge-text-transform': 'inherit',

            //Author styles:
            '--author-font-size': 'inherit',
            '--author-text-transform': 'none',

            //Author avatar styles:
            '--avatar-thumbnail-size': '60px',
            '--avatar-thumbnail-border-radius': '100px',
            '--avatar-thumbnail-text-color': '#0E1311',
            '--avatar-thumbnail-bg-color': 'rgba(0,0,0,0.1)',

            //Product photo or review photo styles:
            '--photo-video-thumbnail-size': '80px',
            '--photo-video-thumbnail-border-radius': '0px',

            //Media (photo & video) slider styles:
            '--mediaslider-scroll-button-icon-color': '#0E1311',
            '--mediaslider-scroll-button-bg-color': 'rgba(255, 255, 255, 0.85)',
            '--mediaslider-overlay-text-color': '#ffffff',
            '--mediaslider-overlay-bg-color': 'rgba(0, 0, 0, 0.8))',
            '--mediaslider-item-size': '110px',

            //Pagination & tabs styles (normal):
            '--pagination-tab-text-color': '#0E1311',
            '--pagination-tab-text-transform': 'none',
            '--pagination-tab-text-letter-spacing': '0',
            '--pagination-tab-text-font-size': '16px',
            '--pagination-tab-text-font-weight': '600',

            //Pagination & tabs styles (active):
            '--pagination-tab-active-text-color': '#0E1311',
            '--pagination-tab-active-text-font-weight': '600',
            '--pagination-tab-active-border-color': '#0E1311',
            '--pagination-tab-border-width': '3px',
        },
        })`;
}

/** @namespace Seedsman/Util/Widget/Index/ratingsWidget */
export function ratingsWidget() {
    return `ratingSnippet("ruk_rating_snippet", {
        store: "seedsman-com",
        mode: "minimal",
        color: "#FFFFFF",
        linebreak: false,
        text: "Reviews",
        singularText: "Review",
        lang: "en",
        usePolaris: false,
        showEmptyStars: false,
      });`;
}

/** @namespace Seedsman/Util/Widget/Index/testimonialsWidget */
export function testimonialsWidget() {
    return `new carouselInlineWidget('ReviewsWidget',{
          /*Your REVIEWS.io account ID:*/
          store: 'seedsman-com',
          sku: '',
          lang: 'en',
          carousel_type: 'topHeader',
          styles_carousel: 'CarouselWidget--topHeader',

          /*Widget settings:*/
          options:{
            general:{
              /*What reviews should the widget display? Available options: company, product, third_party. You can choose one type or multiple separated by comma.*/
              review_type: 'company',
              /*Minimum number of reviews required for widget to be displayed*/
              min_reviews: '1',
              /*Maximum number of reviews to include in the carousel widget.*/
              max_reviews: '20',
              address_format: 'CITY, COUNTRY',
              /*Carousel auto-scrolling speed. 3000 = 3 seconds. If you want to disable auto-scroll, set this value to false.*/
              enable_auto_scroll: 10000,
            },
            header:{
              /*Show overall rating stars*/
              enable_overall_stars: true,
              rating_decimal_places: 2,
            },
            reviews: {
              /*Show customer name*/
              enable_customer_name: true,
              /*Show customer location*/
              enable_customer_location: true,
              /*Show "verified review" badge*/
              enable_verified_badge: true,
              /*Show "verified subscriber" badge*/
              enable_subscriber_badge: true,
              /*Show "I recommend this product" badge (Only for product reviews)*/
              enable_recommends_badge: true,
              /*Show photos attached to reviews*/
              enable_photos: true,
              /*Show videos attached to reviews*/
              enable_videos: true,
              /*Show when review was written*/
              enable_review_date: true,
              /*Hide reviews written by the same customer (This may occur when customer reviews multiple products)*/
              disable_same_customer: true,
              /*Minimum star rating*/
              min_review_percent: 4,
              /*Show 3rd party review source*/
              third_party_source: true,
              /*Hide reviews without comments (still shows if review has a photo)*/
              hide_empty_reviews: true,
              /*Show product name*/
              enable_product_name: true,
              /*Show only reviews which have specific tags (multiple semicolon separated tags allowed i.e tag1;tag2)*/
              tags: "",
              /*Show branch, only one input*/
              branch: "",
              enable_branch_name: false,
            },
            popups: {
              /*Make review items clickable (When they are clicked, a popup appears with more information about a customer and review)*/
              enable_review_popups:  true,
              /*Show "was this review helpful" buttons*/
              enable_helpful_buttons: true,
              /*Show how many times review was upvoted as helpful*/
              enable_helpful_count: true,
              /*Show share buttons*/
              enable_share_buttons: true,
            },
        },
        translations: {
          verified_customer:  "Verified Customer",
        },
        styles:{
          /*Base font size is a reference size for all text elements. When base value gets changed, all TextHeading and TexBody elements get proportionally adjusted.*/
          '--base-font-size': '16px',
          '--base-maxwidth':'100%',

          /*Logo styles:*/
          '--reviewsio-logo-style':'var(--logo-normal)',

          /*Star styles:*/
          '--common-star-color':' #0E1311',
          '--common-star-disabled-color':' rgba(0,0,0,0.25)',
          '--medium-star-size':' 22px',
          '--small-star-size':'19px', /*Modal*/
          '--x-small-star-size':'16px',
          '--x-small-star-display':'inline-flex',

          /*Header styles:*/
          '--header-order':'1',
          '--header-width':'160px',
          '--header-bg-start-color':'transparent',
          '--header-bg-end-color':'transparent',
          '--header-gradient-direction':'135deg',
          '--header-padding':'0.5em',
          '--header-border-width':'0px',
          '--header-border-color':'rgba(0,0,0,0.1)',
          '--header-border-radius':'0px',
          '--header-shadow-size':'0px',
          '--header-shadow-color':'rgba(0, 0, 0, 0.1)',

          /*Header content styles:*/
          '--header-star-color':'inherit',
          '--header-disabled-star-color':'inherit',
          '--header-heading-text-color':'inherit',
          '--header-heading-font-size':'inherit',
          '--header-heading-font-weight':'inherit',
          '--header-heading-line-height':'inherit',
          '--header-heading-text-transform':'inherit',
          '--header-subheading-text-color':'inherit',
          '--header-subheading-font-size':'inherit',
          '--header-subheading-font-weight':'inherit',
          '--header-subheading-line-height':'inherit',
          '--header-subheading-text-transform':'inherit',

          /*Review item styles:*/
          '--item-maximum-columns':'5',/*Must be 3 or larger*/
          '--item-background-start-color':'transparent',
          '--item-background-end-color':'transparent',
          '--item-gradient-direction':'135deg',
          '--item-padding':'0.5em',
          '--item-border-width':'0px',
          '--item-border-color':'rgba(0,0,0,0.1)',
          '--item-border-radius':'0px',
          '--item-shadow-size':'0px',
          '--item-shadow-color':'rgba(0,0,0,0.1)',

          /*Heading styles:*/
          '--heading-text-color':' #0E1311',
          '--heading-text-font-weight':' 600',
          '--heading-text-font-family':' inherit',
          '--heading-text-line-height':' 1.4',
          '--heading-text-letter-spacing':'0',
          '--heading-text-transform':'none',

          /*Body text styles:*/
          '--body-text-color':' #0E1311',
          '--body-text-font-weight':'400',
          '--body-text-font-family':' inherit',
          '--body-text-line-height':' 1.4',
          '--body-text-letter-spacing':'0',
          '--body-text-transform':'none',

          /*Scroll button styles:*/
          '--scroll-button-icon-color':'#0E1311',
          '--scroll-button-icon-size':'24px',
          '--scroll-button-bg-color':'transparent',

          '--scroll-button-border-width':'0px',
          '--scroll-button-border-color':'rgba(0,0,0,0.1)',

          '--scroll-button-border-radius':'60px',
          '--scroll-button-shadow-size':'0px',
          '--scroll-button-shadow-color':'rgba(0,0,0,0.1)',
          '--scroll-button-horizontal-position':'0px',
          '--scroll-button-vertical-position':'0px',

          /*Badge styles:*/
          '--badge-icon-color':'#0E1311',
          '--badge-icon-font-size':'15px',
          '--badge-text-color':'#0E1311',
          '--badge-text-font-size':'inherit',
          '--badge-text-letter-spacing':'inherit',
          '--badge-text-transform':'inherit',

          /*Author styles:*/
          '--author-font-size':'inherit',
          '--author-font-weight':'inherit',
          '--author-text-transform':'inherit',

          /*Product photo or review photo styles:*/
          '--photo-video-thumbnail-size':'60px',
          '--photo-video-thumbnail-border-radius':'0px',

          /*Popup styles:*/
          '--popup-backdrop-color':'rgba(0,0,0,0.75)',
          '--popup-color':'#ffffff',
          '--popup-star-color':'inherit',
          '--popup-disabled-star-color':'inherit',
          '--popup-heading-text-color':'inherit',
          '--popup-body-text-color':'inherit',
          '--popup-badge-icon-color':'inherit',
          '--popup-badge-icon-font-size':'19px',
          '--popup-badge-text-color':'inherit',
          '--popup-badge-text-font-size':'14px',
          '--popup-border-width':'0px',
          '--popup-border-color':'rgba(0,0,0,0.1)',
          '--popup-border-radius':'0px',
          '--popup-shadow-size':'0px',
          '--popup-shadow-color':'rgba(0,0,0,0.1)',
          '--popup-icon-color':'#0E1311',

          /*Tooltip styles:*/
          '--tooltip-bg-color':'#0E1311',
          '--tooltip-text-color':'#ffffff',
        },
      })`;
}

/** @namespace Seedsman/Util/Widget/Index/schemaScript */
export function schemaScript() {
    return `{
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://www.seedsman.com/uk-en/bubba-cheesecake-feminised-seeds-sman-bcc-fem",
          "headline": "Bubba Cheesecake Feminised Seeds",
          "url": "https://www.seedsman.com/us-en/bubba-cheesecake-feminised-seeds-sman-bcc-fem",
          "mentions": [
            {
              "@type": "Thing",
              "name": "cannabis",
              "sameAs": [
                "https://en.wikipedia.org/wiki/Cannabis_(drug)",
                "https://www.google.com/search?q=cannabis&kgmid=/m/054yc0"
              ]
            },
            {
              "@type": "Thing",
              "name": "seeds",
              "sameAs": [
                "https://en.wikipedia.org/wiki/Seed",
                "https://www.google.com/search?q=seeds&kgmid=/m/09dh0"
              ]
            },
            {
              "@type": "Thing",
              "name": "indica",
              "sameAs": [
                "https://en.wikipedia.org/wiki/Cannabis_indica",
                "https://www.google.com/search?q=indica&kgmid=/m/06qst_"
              ]
            },
            {
              "@type": "Thing",
              "name": "marijuana",
              "sameAs": [
                "https://en.wikipedia.org/wiki/Cannabis_(drug)",
                "https://www.google.com/search?q=marijuana&kgmid=/m/054yc0"
              ]
            },
            {
              "@type": "Thing",
              "name": "strains",
              "sameAs": [
                "https://en.wikipedia.org/wiki/Cannabis_strain",
                "https://www.google.com/search?q=strains&kgmid=/m/0hr2vhp"
              ]
            },
            {
              "@type": "Thing",
              "name": "bubba kush",
              "sameAs": [
                "https://en.wikipedia.org/wiki/Cannabis_strain",
                "https://www.google.com/search?q=bubba+kush&kgmid=/m/0hr2vhp"
              ]
            }
          ],
          "isPartOf": {
            "@type": "Article",
            "@id": "https://www.seedsman.com/uk-en/bubba-cheesecake-feminised-seeds-sman-bcc-fem/#article",
            "isPartOf": {
            "@type": "website",
              "@id": "https://www.seedsman.com/uk-en/#website"
            },
            "publisher": {
              "@id": "https://www.seedsman.com/uk-en/#organization",
              "@type": ["Organization", "Brand"],
              "name": "seedsman UK",
              "url": "https://www.seedsman.com/uk-en/",
              "sameAs": "https://maps.google.com/maps?cid=11252184727422460510",
      "parentOrganization": {
        "@type": "Organization",
        "name": "Seedsman USA",
    "url": "https://www.seedsman.com/us-en/"
    },
              "areaServed": [
                {
                  "@type": "Country",
                  "name": "United Kingdom",
                  "sameAs": "https://en.wikipedia.org/wiki/United_Kingdom"
                }
              ],
              "email": "seedsmanusa@seedsman.com",
              "telephone": "1 (720) 650-8315"
            }
          }
        },
        {
          "@type": "Product",
          "name": "Bubba Cheesecake Feminised Seeds",
          "sku": "SMAN-BCC-FEM",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.84",
            "reviewCount": "11"
          },
          "description": "A potent and high-yielding indica-dominant strain that blends U.S. and U.K. Exodus Cheese genetics.",
          "brand": {
            "@type": "Brand",
            "name": "Seedsman"
          },
          "isVariantOf": {
            "@type": "Product",
            "name": "Mostly Indica"
          },
          "color": "purple and blue",
          "countryOfLastProcessing": "UK",
          "category": "Feminized Cannabis Seeds",
          "offers": [
            {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "eligibleQuantity": "1",
              "price": "9.55",
              "priceCurrency": "GBP"
            },
            {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "eligibleQuantity": "3",
              "price": "20.49",
              "priceCurrency": "GBP"
            },
            {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "eligibleQuantity": "5",
              "price": "28.90",
              "priceCurrency": "GBP"
            },
            {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "eligibleQuantity": "10",
              "price": "47.30",
              "priceCurrency": "GBP"
            }
          ],
          "image": [
            "60a6671e5d9eb4d25ce7343f2185d295c063680d89ea6b808cb630e713906e95.jpeg"
          ]
        }
      ]
    }
    `;
}

/** @namespace Seedsman/Util/Widget/Index/cannabisSeedsSchema */
export function cannabisSeedsSchema() {
    return `{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemPage",
      "headline": "Cannabis Seeds Online from Seedsman | Established 2003",
      "url": "https://www.seedsman.com/uk-en/cannabis-seeds",
      "keywords": "cannabis seeds, Marijuana seeds, cannabis seeds UK, cannabis seeds for sale, UK seed banks,  best seeds from seedsman, best uk seed bank",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": ["headline", "description"]
      },
      "mainEntity": {
        "@type": "Product",
        "name": "Cannabis Seeds in UK",
        "description": "Our cannabis seed genetics are sourced from expert breeders across the globe, including the best in autoflowering, regular, and feminised cannabis seeds. Seedsman stocks incredibly potent high THC seeds and the best CBD cannabis seeds online."
      },

      "isPartOf": {
        "@type": "Website",
        "@id": "https://www.seedsman.com/us-en/#website"
      },
      "publisher": {
        "@id": "https://www.seedsman.com/us-en/#organization",
        "@type": ["Organization", "Brand"],
        "name": "Seedsman UK",
        "url": "https://www.seedsman.com/uk-en/",
        "sameAs": [
          "https://maps.google.com/maps?cid=11252184727422460510",
          "https://www.reddit.com/r/CannabisGrowers/",
          "https://twitter.com/SeedsmanSeeds"
        ],
        "parentOrganization": {
          "@type": "Organization",
          "name": "Seedsman UK",
          "url": "https://www.seedsman.com/uk-en/"
        },
        "areaServed": [
          {
            "@type": "Country",
            "name": "United Kingdom",
            "sameAs": "https://en.wikipedia.org/wiki/United_Kingdom"
          }
        ],
        "email": "seedsmanusa@seedsman.com",
        "telephone": "1 (720) 650-8315"
      }
    },
    {
      "@type": "ItemList",
      "numberOfItems": "15",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/flowering-type/feminised-cannabis-seeds",
          "item": "Feminised Cannabis Seeds",
          "description": "Feminized cannabis seeds are an excellent addition for any seed collector, beginner, or pro. Strains available from over 70 different seedbanks, including Dutch Passion, Barney’s Farm, Royal Queen Seeds, and our very own Seedsman Seeds."
        },
        {
          "@type": "ListItem",
          "position": 2,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/flowering-type/regular-cannabis-seeds",
          "item": "Regular Cannabis Seeds",
          "alternateName": "Regular Marijuana Weed Seeds",
          "description": "Seedsman complete seed bank offers a diverse range of regular cannabis seeds. Our range of regular seeds includes old-school varieties to new strains - indica, sativa, and hybrid varieties, and high THC regular cannabis seeds."
        },
        {
          "@type": "ListItem",
          "position": 3,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/flowering-type/autoflowering-regular-seeds",
          "item": "Autoflowering Regular Seeds",
          "alternateName": "Regular Auto Cannabis Seeds Online",
          "description": "Regular autoflower cannabis seeds are autoflowers without the feminized genetic as standard, meaning you get all the benefits of regular cannabis seeds as autoflowers."
        },
        {
          "@type": "ListItem",
          "position": 4,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/variety/high-cbd",
          "item": "High CBD Seeds",
          "alternateName": "Buy High CBD Cannabis Strains In The UK",
          "description": "When cannabis has a high ratio of CBD, intoxicating effects may still be present (if that strain contains any THC), but many people find these to be of a lower degree."
        },
        {
          "@type": "ListItem",
          "position": 5,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/variety/high-thc",
          "item": "High THC Seeds",
          "alternateName": "Buy High THC Cannabis Strains In The UK",
          "description": "Tetrahydrocannabinol, or THC, is the main psychoactive component of cannabis and is responsible for the ‘high’ associated with the plant."
        },
        {
          "@type": "ListItem",
          "position": 6,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/cultivation/grows-indoors",
          "item": "Best Indoor Seeds",
          "alternateName": "The Best Indoor Cannabis Seeds",
          "description": "Use our handy filter on the left-hand side to source the best indoor cannabis seeds for sale online, tailored precisely to your needs."
        },
        {
          "@type": "ListItem",
          "position": 7,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/cultivation/grows-outdoors",
          "item": "Best Outdoor Seeds",
          "alternateName": "The Best Outdoor Cannabis Seeds",
          "description": "In friendlier climates and legal territories, many people look for fun and rewarding outdoor plantations for their passion for gardening."
        },
        {
          "@type": "ListItem",
          "position": 8,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/cultivation/high-yielders",
          "item": "Buy High Yield Cannabis Strains In The UK",
          "alternateName": "The Best High-Yielding Cannabis Seeds",
          "description": "High-yielding cannabis strains are available via feminized photoperiod and autoflowering seeds for small grow rooms or bigger outdoor grows."
        },
        {
          "@type": "ListItem",
          "position": 9,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/cultivation/mould-resistant",
          "item": "Mould Resistant",
          "alternateName": "Mold Resistant Cannabis Strains UK",
          "description": "Choosing the right best mold-resistant cannabis seeds is a solid first step, but there are other things you can do to reduce the risk of moldy cannabis plants."
        },
        {
          "@type": "ListItem",
          "position": 10,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/cultivation/great-for-beginners",
          "item": "Great For Beginners",
          "alternateName": "Cannabis Strains For Beginners",
          "description": "Beyond indica, sativa, and hybrid, the types of cannabis can also be classified into strains. Strains are fundamentally different breeds of cannabis, and they’re bred to have specific effects on the user."
        },
        {
          "@type": "ListItem",
          "position": 11,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/cultivation/quick-flowering",
          "item": "Quick Flowering Seeds",
          "alternateName": "Quick Flowering Cannabis Seeds",
          "description": "The fastest flowering varieties of cannabis. All strains below have a flowering time of 8-9 weeks."
        },
        {
          "@type": "ListItem",
          "position": 12,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/top-picks/new",
          "item": "New Cannabis Seeds",
          "alternateName": "The Best New Cannabis Seeds",
          "description": "We introduce new seeds to our collection on a weekly basis, and it is on this page that you will find the very latest additions to the Seedsman collection."
        },
        {
          "@type": "ListItem",
          "position": 13,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/top-picks/cup-winners",
          "item": "Cup Winner Seeds",
          "alternateName": "The Best Cup Winner Seeds",
          "description": "Considered the very pinnacle of achievement in the field of cannabis, numerous international events are held annually to reward the very best strains of the year."
        },
        {
          "@type": "ListItem",
          "position": 14,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/top-picks/bestsellers",
          "item": "Bestselling Seeds",
          "alternateName": "Bestselling Cannabis Seeds",
          "description": "Latest bestselling strains at Seedsman. These include White Widow, Blueberry, Original Skunk, and Critical Kush."
        },
        {
          "@type": "ListItem",
          "position": 15,
          "url": "https://www.seedsman.com/uk-en/cannabis-seeds/top-picks/seeds-under-c-10",
          "item": "Seeds Under £10",
          "alternateName": "Best Seeds Under £10",
          "description": "Seeds Under £10"
        }
      ]
    }
  ]
}`;
}
