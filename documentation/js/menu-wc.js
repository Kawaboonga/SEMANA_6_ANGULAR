'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">proyecto-semana4 documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AdBanner.html" data-type="entity-link" >AdBanner</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminCursosComponent.html" data-type="entity-link" >AdminCursosComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminDashboard.html" data-type="entity-link" >AdminDashboard</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminLayout.html" data-type="entity-link" >AdminLayout</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminProductos.html" data-type="entity-link" >AdminProductos</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminTutores.html" data-type="entity-link" >AdminTutores</a>
                            </li>
                            <li class="link">
                                <a href="components/AdminUsuarios.html" data-type="entity-link" >AdminUsuarios</a>
                            </li>
                            <li class="link">
                                <a href="components/App.html" data-type="entity-link" >App</a>
                            </li>
                            <li class="link">
                                <a href="components/BreadcrumbComponent.html" data-type="entity-link" >BreadcrumbComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Carousel.html" data-type="entity-link" >Carousel</a>
                            </li>
                            <li class="link">
                                <a href="components/Contacto.html" data-type="entity-link" >Contacto</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseCardComponent.html" data-type="entity-link" >CourseCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CourseFormComponent.html" data-type="entity-link" >CourseFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CursoDetailComponent.html" data-type="entity-link" >CursoDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/CursosListComponent.html" data-type="entity-link" >CursosListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/FooterComponent.html" data-type="entity-link" >FooterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Home.html" data-type="entity-link" >Home</a>
                            </li>
                            <li class="link">
                                <a href="components/LoadingComponent.html" data-type="entity-link" >LoadingComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/LoginComponent.html" data-type="entity-link" >LoginComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/MainLayout.html" data-type="entity-link" >MainLayout</a>
                            </li>
                            <li class="link">
                                <a href="components/NavbarComponent.html" data-type="entity-link" >NavbarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/NewsCard.html" data-type="entity-link" >NewsCard</a>
                            </li>
                            <li class="link">
                                <a href="components/NoticiaDetalle.html" data-type="entity-link" >NoticiaDetalle</a>
                            </li>
                            <li class="link">
                                <a href="components/Noticias.html" data-type="entity-link" >Noticias</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductCardComponent.html" data-type="entity-link" >ProductCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductCategoryBannerComponent.html" data-type="entity-link" >ProductCategoryBannerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductDetailComponent.html" data-type="entity-link" >ProductDetailComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductFiltersComponent.html" data-type="entity-link" >ProductFiltersComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductFormComponent.html" data-type="entity-link" >ProductFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductGridComponent.html" data-type="entity-link" >ProductGridComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProductListComponent.html" data-type="entity-link" >ProductListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/Profile.html" data-type="entity-link" >Profile</a>
                            </li>
                            <li class="link">
                                <a href="components/Recover.html" data-type="entity-link" >Recover</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterComponent.html" data-type="entity-link" >RegisterComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ServicioDetail.html" data-type="entity-link" >ServicioDetail</a>
                            </li>
                            <li class="link">
                                <a href="components/ServiciosList.html" data-type="entity-link" >ServiciosList</a>
                            </li>
                            <li class="link">
                                <a href="components/Somos.html" data-type="entity-link" >Somos</a>
                            </li>
                            <li class="link">
                                <a href="components/TutorCardComponent.html" data-type="entity-link" >TutorCardComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TutoresListComponent.html" data-type="entity-link" >TutoresListComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TutorFilterBarComponent.html" data-type="entity-link" >TutorFilterBarComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TutorFormComponent.html" data-type="entity-link" >TutorFormComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TutorProfileComponent.html" data-type="entity-link" >TutorProfileComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/UserFormComponent.html" data-type="entity-link" >UserFormComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#directives-links"' :
                                'data-bs-target="#xs-directives-links"' }>
                                <span class="icon ion-md-code-working"></span>
                                <span>Directives</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="directives-links"' : 'id="xs-directives-links"' }>
                                <li class="link">
                                    <a href="directives/FadeUpDirective.html" data-type="entity-link" >FadeUpDirective</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AdminDataService.html" data-type="entity-link" >AdminDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CarouselDataService.html" data-type="entity-link" >CarouselDataService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CourseService.html" data-type="entity-link" >CourseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LoadingService.html" data-type="entity-link" >LoadingService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/NewsService.html" data-type="entity-link" >NewsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductService.html" data-type="entity-link" >ProductService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ServiceService.html" data-type="entity-link" >ServiceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TutorService.html" data-type="entity-link" >TutorService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/AdminUser.html" data-type="entity-link" >AdminUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AvailabilityOption.html" data-type="entity-link" >AvailabilityOption</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Breadcrumb.html" data-type="entity-link" >Breadcrumb</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BreadcrumbItem.html" data-type="entity-link" >BreadcrumbItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CarouselItem.html" data-type="entity-link" >CarouselItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CarouselItem-1.html" data-type="entity-link" >CarouselItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Course.html" data-type="entity-link" >Course</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CourseReview.html" data-type="entity-link" >CourseReview</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/News.html" data-type="entity-link" >News</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Product.html" data-type="entity-link" >Product</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProductFilter.html" data-type="entity-link" >ProductFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterPayload.html" data-type="entity-link" >RegisterPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RegisterResult.html" data-type="entity-link" >RegisterResult</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Service.html" data-type="entity-link" >Service</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Tutor.html" data-type="entity-link" >Tutor</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TutorCourseRef.html" data-type="entity-link" >TutorCourseRef</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TutorFilter.html" data-type="entity-link" >TutorFilter</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TutorGearItem.html" data-type="entity-link" >TutorGearItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TutorReview.html" data-type="entity-link" >TutorReview</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/WeeklySlot.html" data-type="entity-link" >WeeklySlot</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#pipes-links"' :
                                'data-bs-target="#xs-pipes-links"' }>
                                <span class="icon ion-md-add"></span>
                                <span>Pipes</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="pipes-links"' : 'id="xs-pipes-links"' }>
                                <li class="link">
                                    <a href="pipes/TruncatePipe.html" data-type="entity-link" >TruncatePipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});