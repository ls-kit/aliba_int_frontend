import React, {useState} from "react";
import {connect} from "react-redux";
import {withRouter} from "react-router";
import {prepareSearching} from "../../../store/actions/ProductAction"
import _ from "lodash";
import {loadPictureSearchProducts} from "../../../utils/Services";
import {in_loading, out_loading} from "../../../utils/LoadingState";

const SearchForm = (props) => {
   const {match, history} = props;
   const params = !_.isEmpty(match) ? match.params : {};
   const searchKey = !_.isEmpty(params) ? params.searchKey : "";
   const [search, setSearch] = useState("");

   const submitTextSearch = (e) => {
      e.preventDefault();
      history.push(`/search/${search}`);
   };


   const submitPictureSearch = (e) => {
      e.preventDefault();
      const selectedFile = e.target.files[0];
      if (selectedFile.name !== undefined) {
         in_loading();
         let formData = new FormData();
         formData.append("picture", selectedFile);
         loadPictureSearchProducts(formData)
            .then(response => {
               let picture = response.picture;
               let search_id = response.search_id;
               if (search_id && picture) {
                  history.push(`/search/picture/${search_id}`);
               }
               out_loading();
            });
      }
   };


   return (
      <div className="header-search header-search-visible header-search-no-radius">

         <input
            type="file"
            onChange={e => submitPictureSearch(e)}
            name="picture"
            className="d-none"
            id="lg_picture_search"/>

         <form onSubmit={(e) => submitTextSearch(e)} method="get">
            <div className="header-search-wrapper search-wrapper-wide">
               <label htmlFor="search" className="sr-only">
                  Search
               </label>
               <input
                  type="search"
                  className="form-control"
                  id="search"
                  value={search || searchKey}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search million products by keyword or image"
                  autoComplete="off"
                  required
               />

               <label className="btn btn-search label_btn" htmlFor="lg_picture_search">
                  <i className="fa-camera fas"/>
               </label>

               <button className="btn btn-primary" type="submit">
                  <i className="icon-search"/>
               </button>
            </div>
         </form>
      </div>
   );
};


const mapStateToProps = (state) => ({
   general: JSON.parse(state.INIT.general),
   search_products: state.PRODUCTS.search_products,
   picture_search_products: state.PRODUCTS.picture_search_products,
});

export default connect(mapStateToProps, {prepareSearching})(
   withRouter(SearchForm)
);

