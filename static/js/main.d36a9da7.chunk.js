(this.webpackJsonpnycrestuarants=this.webpackJsonpnycrestuarants||[]).push([[0],{26:function(A,e,n){},46:function(A,e,n){},47:function(A,e,n){"use strict";n.r(e);var t=n(0),i=n.n(t),a=n(6),c=n.n(a),s=(n(26),n(9)),r=n(5),l=n(11),o=n(3),u=function(A,e){for(var n=[],t=0;t<e.length;t++)for(var i=e[t][A],a=0;a<i.length;a++)n.includes(i[a])||""===i[a]||n.push(i[a]);return n.sort(),n},d=n(1);var g=function(A){return Object(d.jsx)("div",{className:"loading-wrapper",children:Object(d.jsx)("div",{className:"loading"})})};function h(A){var e=Object(t.useState)([]),n=Object(o.a)(e,2),i=n[0],a=n[1];return Object(t.useEffect)((function(){var e=A.restaurants;e=e.filter((function(A,e,n){return n.findIndex((function(e){return e.name===A.name}))===e})),a(e)}),[A.restaurants]),Object(d.jsx)("div",{className:"eateries-wrapper",children:A.loaded?i.map((function(e,n){return Object(d.jsx)(j,{res:e,fetchData:A.fetchData},n)})):Object(d.jsx)(g,{})})}function j(A){return Object(d.jsxs)("div",{className:"eatery",children:[Object(d.jsx)("h3",{onClick:function(){return A.fetchData(A.res)},children:A.res.name}),Object(d.jsxs)("p",{className:"eatery-cuisines",children:[A.res.cuisine.map((function(A,e){return 0===e?A:", "+A}))," | ",function(){for(var e="",n=0;n<A.res.price;n++)e+="$";return e}()]}),Object(d.jsx)("p",{children:A.res.location.map((function(A,e){return 0===e?A:", "+A}))})]})}var b=n(8),p={width:"100%",height:"700px"},f={styles:[{featureType:"administrative",elementType:"labels.text.fill",stylers:[{color:"#000000"}]},{featureType:"administrative.neighborhood",elementType:"labels.text",stylers:[{color:"#d1bba1"},{visibility:"simplified"}]},{featureType:"administrative",elementType:"labels.text.stroke",stylers:[{color:"#f1e5d5"}]},{featureType:"landscape",elementType:"all",stylers:[{color:"#f2f2f2"}]},{featureType:"landscape",elementType:"geometry",stylers:[{color:"#ebd8c3"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"road",elementType:"all",stylers:[{color:"#f1e5d5"},{saturation:0},{lightness:0}]},{featureType:"road.highway",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.highway",elementType:"geometry.fill",stylers:[{color:"#000000"}]},{featureType:"road.arterial",elementType:"all",stylers:[{visibility:"simplified"}]},{featureType:"road.arterial",elementType:"labels",stylers:[{color:"#ffffff"},{visibility:"on"},{lightness:"31"}]},{featureType:"road.arterial",elementType:"labels.text.stroke",stylers:[{visibility:"off"}]},{featureType:"road.arterial",elementType:"labels.icon",stylers:[{visibility:"off"}]},{featureType:"road.local",elementType:"all",stylers:[{visibility:"on"}]},{featureType:"road.local",elementType:"labels",stylers:[{color:"#ffffff"},{visibility:"simplified"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{color:"#000000"},{visibility:"on"}]},{featureType:"water",elementType:"geometry.fill",stylers:[{color:"#f1e5d5"}]}]},O={lat:40.74,lng:-74.006};function B(A){Object(t.useRef)();var e=Object(t.useState)({open:!1,index:-1}),n=Object(o.a)(e,2),i=n[0],a=n[1],c=Object(t.useState)([]),s=Object(o.a)(c,2),r=s[0],l=s[1];Object(t.useEffect)((function(){l(A.restaurants)}),[A.restaurants]);var u=Object(b.d)({googleMapsApiKey:"".concat("AIzaSyAsBasMtERBic_FV-rLd7CULK6hbXXH5ro"),libraries:["places"]}),h=u.isLoaded;if(u.loadError)return Object(d.jsx)("div",{children:"Map cannot be loaded right now, sorry."});return Object(d.jsx)("div",{className:"map-container",children:h&&A.loaded?Object(d.jsx)(b.a,{center:O,zoom:14,mapContainerStyle:p,options:f,children:r.map((function(e,n){return Object(d.jsx)(Q,{res:r[n],index:n,selectedMarker:i.index,setInfo:a,fetchData:A.fetchData},n)}))}):Object(d.jsx)(g,{})})}var D={collisionBehavior:"REQUIRED_AND_HIDES_OPTIONAL"};function Q(A){var e=Object(t.useRef)(A.index);return Object(d.jsx)("div",{children:Object(d.jsx)(b.c,{position:{lat:A.res.lat,lng:A.res.lng},onClick:function(){return A.setInfo({open:!0,index:e.current})},icon:{url:A.res.cuisine.includes("Bagels")?"/bon-viveur/bagel.png":A.res.category.includes("Rooftop")?"/bon-viveur/cocktail.png":A.res.cuisine.includes("Pizza")?"/bon-viveur/pizza.png":A.res.cuisine.includes("Bakery")?"/bon-viveur/bakery.png":A.res.cuisine.includes("Tea")?"/bon-viveur/tea.png":A.res.cuisine.includes("Coffee")?"/bon-viveur/coffee.png":A.res.cuisine.includes("Ice Cream")?"/bon-viveur/icecream.png":A.res.cuisine.includes("Mediterranean")?"/bon-viveur/mediterranean.png":A.res.cuisine.includes("Korean")?"/bon-viveur/korean.png":A.res.cuisine.includes("Japanese")?"/bon-viveur/japanese.png":A.res.cuisine.includes("Mexican")?"/bon-viveur/mexican.png":A.res.cuisine.includes("Italian")?"/bon-viveur/italian.png":A.res.cuisine.includes("Dim Sum")?"/bon-viveur/dumpling.png":A.res.cuisine.includes("Chinese")?"/bon-viveur/chinese.png":A.res.cuisine.includes("French")?"/bon-viveur/french.png":A.res.cuisine.includes("Bar")?"/bon-viveur/beer.png":A.res.cuisine.includes("Vegan")?"/bon-viveur/vegan.png":A.res.cuisine.includes("Asian")||A.res.cuisine.includes("Thai")||A.res.cuisine.includes("Southeast Asian")||A.res.cuisine.includes("Vietnamese")||A.res.cuisine.includes("Filipino")||A.res.cuisine.includes("Taiwanese")?"/bon-viveur/asian.png":A.res.category.includes("Brunch")?"/bon-viveur/avocado.png":A.res.category.includes("Desserts")?"/bon-viveur/dessert.png":"/bon-viveur/restaurant.png",scaledSize:{width:32,height:32}},options:D,children:A.selectedMarker===e.current&&Object(d.jsx)(b.b,{position:{lat:A.res.lat,lng:A.res.lng},options:{},children:Object(d.jsx)(j,{res:A.res,fetchData:A.fetchData})})})})}var w=i.a.memo(B),C=n.p+"static/media/Restaurants.52f60537.csv",m=n(21),M=n.n(m),x={},v=[];var y=function(A,e,n){if(n(Object(r.a)(Object(r.a)({},e),{},{loading:!0})),x.hasOwnProperty(A.id))n({open:!0,data:x[A.id],rest:A,loading:!1,error:!1});else{var t={term:A.name,latitude:A.lat,longitude:A.lng,sort_by:"best_match",limit:1},i="https://tranquil-waters-09571.herokuapp.com/".concat("https://api.yelp.com/v3/businesses/search");M.a.get(i,{headers:{Authorization:"Bearer ".concat("ADRBX-UxZiZKehLa6yxp4gpCLqr3O39muhcVRQQ8IKX-fJc0PixZNS6FIOIt6FD4CeMNhxbhyBiPppaxooa4qcScqm2CZrG-FB_eX2m1ikFQ8astC1fbhKdAmkk0X3Yx")},params:t}).then((function(e){e.data.businesses||e.data;var t=e.data.businesses[0];x[A.id]={is_closed:t.is_closed,name:t.name,price:t.price,rating:t.rating,categories:t.categories,location:{display_address:t.location.display_address},display_phone:t.display_phone,url:t.url},v.push(A.id),v.length>50&&(delete x[v[0]],v.shift()),n({open:!0,data:e.data.businesses[0],rest:A,loading:!1,error:!1})})).catch((function(A){n(Object(r.a)(Object(r.a)({},e),{},{error:!0,loading:!1,open:!0}))}))}},E=n.p+"static/media/unfilled.35da6e04.png",I=n.p+"static/media/halfstar.f2b5f456.png",G=n.p+"static/media/mappin.5c365d0f.png",Y=n.p+"static/media/phone.d3374a1e.png",N=n.p+"static/media/yelp.dd33b665.png",F=(n(46),{Asian:["Southeast Asian","Chinese","Japanese","Korean","Taiwanese","Thai","Vietnamese","Filipino","Indian"],"Southeast Asian":["Thai","Vietnamese","Filipino"],American:["Southern"],Chinese:["Dim Sum"]});function P(A){for(var e=[],n=Math.floor(A.data.rating),t=0;t<n;t++)e.push("filled");var i=0;A.data.rating%1!==0&&(e.push("half"),i=1);for(var a=5-n-i,c=0;c<a;c++)e.push("unfilled");return Object(d.jsx)("div",{className:"dialog-wrapper",children:Object(d.jsxs)("div",{className:"dialog",children:[Object(d.jsx)("p",{className:"close",onClick:A.close,children:"X"}),A.state.loading?Object(d.jsx)(g,{}):A.state.error?Object(d.jsx)("h4",{children:"There was an error."}):Object(d.jsxs)("div",{className:"dialog-content",children:[Object(d.jsx)("h3",{children:A.data.name}),A.data.is_closed?Object(d.jsx)("p",{className:"closed",children:"permanently closed"}):"",Object(d.jsxs)("div",{className:"star-container",children:[Object(d.jsx)("div",{className:"star-wrapper",children:e.map((function(A,e){return Object(d.jsx)(T,{type:A},e)}))}),Object(d.jsx)("p",{children:" | "+(A.data.price||function(A){for(var e="",n=0;n<A;n++)e+="$";return e}(A.state.rest.price))})]}),Object(d.jsx)("h4",{children:A.data.categories.map((function(A,e){var n="";return e>0&&(n+=", "),n+=A.title}))}),Object(d.jsxs)("div",{className:"dialog-info",children:[Object(d.jsx)("img",{src:G}),Object(d.jsx)("p",{children:Object(d.jsx)("a",{href:"https://maps.google.com/?q="+A.data.location.display_address[0]+", "+A.data.location.display_address[1],target:"_blank",children:A.data.location.display_address[0]+", "+A.data.location.display_address[1]})})]}),Object(d.jsxs)("div",{className:"dialog-info",children:[Object(d.jsx)("img",{src:Y}),Object(d.jsx)("p",{children:A.data.display_phone||"N/A"})]}),Object(d.jsxs)("div",{className:"dialog-info",children:[Object(d.jsx)("img",{src:N}),Object(d.jsx)("p",{children:Object(d.jsx)("a",{href:A.data.url,target:"_blank",children:"Yelp"})})]})]})]})})}function T(A){var e={filled:"data:image/png;base64,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",unfilled:E,half:I};return Object(d.jsx)("img",{src:e[A.type],alt:"restaurant",className:"star"})}var H=function(){var A=Object(t.useState)([]),e=Object(o.a)(A,2),n=e[0],i=e[1],a=Object(t.useState)(!1),c=Object(o.a)(a,2),g=c[0],j=c[1],b=Object(t.useState)(!1),p=Object(o.a)(b,2),f=p[0],O=p[1],B=Object(t.useState)([]),D=Object(o.a)(B,2),Q=D[0],m=D[1],M=Object(t.useState)([]),x=Object(o.a)(M,2),v=x[0],E=x[1],I=Object(t.useState)([]),G=Object(o.a)(I,2),Y=G[0],N=G[1],T=Object(t.useState)([]),H=Object(o.a)(T,2),R=H[0],z=H[1],K=Object(t.useState)({open:!1,loading:!1,error:!1,data:{},rest:{}}),k=Object(o.a)(K,2),U=k[0],V=k[1],S=Object(t.useState)({cuisine:"All",category:"All",location:"All",price:"All"}),L=Object(o.a)(S,2),Z=L[0],J=L[1];Object(t.useEffect)((function(){X()}),[]),Object(t.useEffect)((function(){var A=u("cuisine",n);m(["All"].concat(Object(l.a)(A)));var e=u("category",n);E(["All"].concat(Object(l.a)(e)));var t=u("location",n);N(["All"].concat(Object(l.a)(t))),z(n)}),[n]),Object(t.useEffect)((function(){var A=_();z(A)}),[Z]),Object(t.useEffect)((function(){console.log("scroll change"),U.open||U.loading?document.body.classList.add("no-scroll"):document.body.classList.remove("no-scroll")}),[U]);var X=function(){fetch(C).then((function(A){return A.text()})).then(W)},W=function(A){var e=function(A){var e=A.split("\n").map((function(A){return A.split(",")})),n=e.shift();return(e=e.filter((function(A){return A.length>=7}))).map((function(A,e){var t={};return n.map((function(e,i){if("cuisine"===n[i]||"location"===n[i]||"category"===n[i]){var a=A[i].split("|");t[n[i]]=a}else if("lat"===n[i]||"lng"===n[i])t[n[i]]=parseFloat(A[i]);else{var c=A[i].trim();t[n[i]]=c}})),t.id=e,t}))}(A);i(e),j(!0)},q=function(A,e){J(Object(r.a)(Object(r.a)({},Z),{},Object(s.a)({},A.target.name,A.target.value)))},_=function(){var A=n;if("All"!==Z.cuisine)if(F.hasOwnProperty(Z.cuisine)){var e=F[Z.cuisine];A=A.filter((function(A){var n=!1;return e.forEach((function(e){A.cuisine.includes(e)&&(n=!0)})),!!n||A.cuisine.includes(Z.cuisine)}))}else A=A.filter((function(A){return A.cuisine.includes(Z.cuisine)}));return"All"!==Z.category&&(A=A.filter((function(A){return A.category.includes(Z.category)}))),"All"!==Z.location&&(A=A.filter((function(A){return A.location.includes(Z.location)}))),"All"!==Z.price&&(A=A.filter((function(A){return A.price==Z.price}))),A},$=function(A){y(A,U,V)};return Object(d.jsxs)("div",{className:"App",children:[Object(d.jsxs)("header",{className:"App-header",children:[Object(d.jsx)("h1",{children:"BON VIVEUR"}),Object(d.jsx)("h2",{children:"New York City"}),Object(d.jsx)("div",{onClick:function(){return O(!f)},className:"nav",children:Object(d.jsx)("img",{src:f?"data:image/png;base64,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":"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+VemSAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAArpJREFUeNrs2dFNwzAUQFE/5AEYhQ1IJ6ErsAFswEZNN8gIjNANHq8TUIQa1ck5kuWf/NjuVRw1WmvZgBGdn+wBjEvAIGBAwICAQcCAgIH76Tc8815jsVWwumONt/8GvGTmbC9hXRExuUKDb2BAwICAAQGDgAEBAwIGAQMCBgQMCBgEDAgYEDAI2BaAgAEBAwIGAQMCBgQMCBgEDAgYEDAIGBAwIGBAwCBgQMCAgAEBg4ABAQMCBgEDAgYEDAgYBAwIGBAwIGAQMCBgQMAgYEDAgIABAYOAgQfSt7y4iJhqOjnm/crM8AYGBAwIGBAwCBgQMCBg2Jm+8fUtNQ6OGQEPKDMvNc2OGVdoQMCAgAEBg4ABAQMCBgEDAgYEDAgYBAwIGBAwCBgQMCBgQMAgYEDAgIABAYOAAQEDAgYBAwIGBAwIGAQMCBgQMCBgEDAgYEDAIGBAwICAAQGDgAEBAwIGWt/y4iJiqunkmPcrM8MbGBAwIGBAwCBgQMCAgGFn+sbXt9Q4OGYEPKDMvNQ0O2ZcoQEBAwIGBAwCBgQMCBgEDAgYEDAgYBAwIGBAwCBgQMCAgAEBg4ABAQMCBgQMAgYEDAgYBAwIGBAwIGAQMCBgQMCAgEHAgIABAYOAAQEDAgYEDAIGBAwIGGh9y4uLiJeavhzzfmXmJOBxPdd49TPGFRoQMCBgQMAgYEDAwF9t/W+k7xqfjhkBDygzrwF/OGZcoQEBAwIGBAwCBgQMCBgEDAgYEDAgYBAwIGBAwCBgQMCAgAEBg4ABAQMCBgQMAgYEDAgYBAwIGBAwIGAQMCBgQMCAgEHAgIABAYOAAQEDAgYEDAIGBAwIGBAwCBgQMCBgEDAgYEDAgIBBwMCj6Dc8c4yIyVbB6n7tLmqkfYIhnV2hwTcwIGBAwCBgQMDA/Vz/RpptAwxp+RFgADaxLERRU2b4AAAAAElFTkSuQmCC",style:{width:"100%"}})}),Object(d.jsx)("div",{className:"cuisines",children:Object(d.jsxs)("form",{children:[Object(d.jsxs)("label",{children:["Cuisine",Object(d.jsx)("select",{value:Z.cuisine,name:"cuisine",onChange:q,children:Q.map((function(A){return Object(d.jsx)("option",{value:A,children:A})}))})]}),Object(d.jsxs)("label",{children:["Category",Object(d.jsx)("select",{value:Z.category,name:"category",onChange:q,children:v.map((function(A){return Object(d.jsx)("option",{value:A,children:A})}))})]}),Object(d.jsxs)("label",{children:["Location",Object(d.jsx)("select",{value:Z.location,name:"location",onChange:q,children:Y.map((function(A){return Object(d.jsx)("option",{value:A,children:A})}))})]}),Object(d.jsxs)("label",{children:["Price",Object(d.jsxs)("select",{value:Z.price,name:"price",onChange:q,children:[Object(d.jsx)("option",{value:"All",children:"All"}),Object(d.jsx)("option",{value:"1",children:"$"}),Object(d.jsx)("option",{value:"2",children:"$$"}),Object(d.jsx)("option",{value:"3",children:"$$$"}),Object(d.jsx)("option",{value:"4",children:"$$$$"})]})]}),Object(d.jsx)("input",{type:"reset",onClick:function(){J({cuisine:"All",category:"All",location:"All",price:"All"})}}),Object(d.jsx)("button",{onClick:function(A){A.preventDefault();var e=_(),n=Math.floor(Math.random()*e.length);z([e[n]])},children:"Random"})]})})]}),U.loading||U.open?Object(d.jsx)(P,{state:U,data:U.data,close:function(){return V(Object(r.a)(Object(r.a)({},U),{},{open:!1}))}}):Object(d.jsx)("div",{}),f?Object(d.jsx)(h,{restaurants:R,fetchData:$,loaded:g}):Object(d.jsx)(w,{restaurants:R,setRes:i,loaded:g,fetchData:$})]})},R=function(A){A&&A instanceof Function&&n.e(3).then(n.bind(null,48)).then((function(e){var n=e.getCLS,t=e.getFID,i=e.getFCP,a=e.getLCP,c=e.getTTFB;n(A),t(A),i(A),a(A),c(A)}))};c.a.render(Object(d.jsx)(i.a.StrictMode,{children:Object(d.jsx)(H,{})}),document.getElementById("root")),R()}},[[47,1,2]]]);
//# sourceMappingURL=main.d36a9da7.chunk.js.map