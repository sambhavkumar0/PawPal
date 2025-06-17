
function showBookingForm() {
    const bookingModal = new bootstrap.Modal(document.getElementById('bookingModal'));
    bookingModal.show();
}


$(document).ready(function() {


            
            const servicesData = {
                "dog_walking": {
                    title: "Dog Walking Adventures",
                    shortDescription: "Give your furry friend the exercise and fresh air they crave with our professional dog walking services.",
                    longDescription: "Our experienced and passionate dog walkers provide personalized walks tailored to your dog's energy levels, breed, and specific needs. Whether it's a brisk jog, a leisurely stroll in the park, or a quick potty break, we ensure your dog enjoys their time outdoors. We use secure leashes and follow your preferred routes, always prioritizing your pet's safety and happiness. Choose from 30-minute, 60-minute, or custom walk durations.",
                    // Changed to a more specific placeholder
                    image: "https://via.placeholder.com/400x300/ADD8E6/000000?text=Dog+Walking+Image",
                    pricing: "Starts from $25/hour",
                    duration: "30-60 minutes per session",
                    idealFor: "Energetic dogs, busy owners, socialization",
                    features: [
                        "Personalized routes and pace",
                        "GPS tracking for walks (optional)",
                        "Fresh water and treat after walk",
                        "Waste disposal",
                        "Updates with photos after each walk"
                    ]
                },
                "pet_sitting": {
                    title: "Comforting In-Home Pet Sitting",
                    shortDescription: "Your pets stay happy and stress-free in the comfort of their own home while you're away.",
                    longDescription: "Going on vacation or a business trip? Our in-home pet sitting service provides your beloved companions with the familiar comfort of their own environment. Our trusted sitters will visit your home multiple times a day (or provide overnight stays) to ensure feeding, fresh water, playtime, litter box cleaning, and any necessary medication administration. We also offer basic home care like mail collection and plant watering.",
                    // Changed to a more specific placeholder
                    image: "https://via.placeholder.com/400x300/F0F8FF/000000?text=Pet+Sitting+Image",
                    pricing: "Starts from $50/day",
                    duration: "Multiple daily visits or overnight stays",
                    idealFor: "Pets who prefer home, multi-pet households",
                    features: [
                        "Feeding and fresh water replenishment",
                        "Playtime and cuddles",
                        "Litter box/cage cleaning",
                        "Medication administration (if needed)",
                        "Mail collection and plant watering"
                    ]
                },
                "pet_grooming": {
                    title: "Professional Pet Grooming",
                    shortDescription: "Keep your pet looking and feeling their best with our comprehensive grooming services.",
                    longDescription: "Our certified groomers provide a full range of services including breed-specific cuts, de-shedding treatments, nail trims, ear cleaning, and luxurious baths with hypoallergenic shampoos. We prioritize a stress-free experience for your pet, using gentle techniques and positive reinforcement. From a simple tidy-up to a full spa day, we'll have your pet looking show-ready!",
                    // Changed to a more specific placeholder
                    image: "https://via.placeholder.com/400x300/FFF8DC/000000?text=Grooming+Image",
                    pricing: "Varies by breed & service, from $60",
                    duration: "1-3 hours",
                    idealFor: "All breeds, regular maintenance",
                    features: [
                        "Full bath & blow dry",
                        "Haircut/trim (breed-specific options)",
                        "Nail clipping & filing",
                        "Ear cleaning & plucking",
                        "Paw pad care"
                    ]
                },
                "vet_appointments": {
                    title: "Veterinary Care",
                    shortDescription: "Complete veterinary services from routine checkups to emergency care.",
                    longDescription: "We facilitate comprehensive veterinary services to ensure your pet's optimal health. This includes arranging routine check-ups, vaccinations, dental care, and connecting you with emergency care when needed. We aim to make pet healthcare seamless and accessible, prioritizing preventive care to keep your companion healthy and happy for years to come.",
                    // Changed to a more specific placeholder
                    image: "https://via.placeholder.com/400x300/E0FFFF/000000?text=Vet+Care+Image",
                    pricing: "Varies by service",
                    duration: "Dependent on service",
                    idealFor: "All pets, health-conscious owners",
                    features: [
                        "Routine checkups & preventative care",
                        "Vaccinations & parasite control",
                        "Dental care coordination",
                        "Emergency care guidance",
                        "Specialist referrals"
                    ]
                },
                // ... (rest of your services data with updated image URLs)
                "cat_care": {
                    title: "Specialized Feline Care",
                    shortDescription: "Dedicated and compassionate care for your cats, ensuring their comfort and happiness.",
                    longDescription: "Cats have unique needs, and our specialized cat care service caters to them perfectly. We provide daily visits that include feeding, fresh water, litter box cleaning, playtime with favorite toys, and plenty of gentle petting and affection. We understand feline behavior and strive to keep your cat's routine as normal as possible.",
                    image: "https://via.placeholder.com/400x300/FFE4B5/000000?text=Cat+Care+Image",
                    pricing: "Starts from $30/visit",
                    duration: "30-45 minutes per visit",
                    idealFor: "Cats who prefer their own home, anxious cats",
                    features: [
                        "Feeding and fresh water",
                        "Litter box scooping and cleaning",
                        "Playtime and enrichment",
                        "Cuddles and attention",
                        "Mail collection and plant watering (optional)"
                    ]
                },
                "pet_training": {
                    title: "Professional Pet Obedience Training",
                    shortDescription: "Transform your pet's behavior with positive reinforcement training sessions.",
                    longDescription: "Our certified trainers offer personalized obedience training programs for dogs of all ages and breeds. We focus on positive reinforcement techniques to teach essential commands like sit, stay, come, and leash manners. Whether you're dealing with puppy antics or adult dog challenges, we provide effective and humane solutions to build a stronger bond between you and your pet.",
                    image: "https://via.placeholder.com/400x300/E6E6FA/000000?text=Training+Image",
                    pricing: "Starts from $75/session",
                    duration: "45-60 minutes per session",
                    idealFor: "Puppies, new rescues, behavioral challenges",
                    features: [
                        "Basic and advanced obedience",
                        "Leash training",
                        "House-training support",
                        "Problem behavior modification",
                        "Owner coaching"
                    ]
                },
                "boarding_daycare": {
                    title: "Premium Boarding & Daycare",
                    shortDescription: "A fun and safe temporary home for your pet when you're away.",
                    longDescription: "Our state-of-the-art boarding and daycare facility offers a stimulating and comfortable environment for your beloved pet. With spacious play areas, constant supervision, and dedicated staff, your pet will enjoy their stay as much as you enjoy your time away. We offer both full-day daycare and overnight boarding options, including feeding, exercise, and social play.",
                    image: "https://via.placeholder.com/400x300/F5F5DC/000000?text=Boarding+Daycare+Image",
                    pricing: "Starts from $40/day",
                    duration: "Full-day or overnight",
                    idealFor: "Social pets, owners needing extended care",
                    features: [
                        "Supervised group play",
                        "Individual kennels/suites (for boarding)",
                        "Regular potty breaks",
                        "Feeding according to schedule",
                        "Administering medication"
                    ]
                },
                "pet_photography": {
                    title: "Professional Pet Photography",
                    shortDescription: "Capture the unique personality and beauty of your furry family members.",
                    longDescription: "Our talented pet photographers specialize in creating stunning portraits that truly reflect your pet's spirit. Whether it's action shots in the park, cozy studio portraits, or candid moments at home, we work patiently to capture those precious memories. We offer various packages including digital files, prints, and custom albums.",
                    image: "https://via.placeholder.com/400x300/DDA0DD/000000?text=Photography+Image",
                    pricing: "Starts from $150/session",
                    duration: "1-2 hour session",
                    idealFor: "Creating lasting memories, gifts",
                    features: [
                        "Outdoor or studio sessions",
                        "High-resolution digital images",
                        "Selection of prints/canvases",
                        "Option for owner participation",
                        "Online gallery for proofing"
                    ]
                },
                "pet_first_aid": {
                    title: "Pet First Aid & CPR Training",
                    shortDescription: "Learn essential life-saving skills to help your pet in an emergency.",
                    longDescription: "Be prepared for any pet emergency with our certified Pet First Aid & CPR courses. Taught by veterinary professionals, these hands-on workshops cover vital topics like choking, bleeding, poisoning, heatstroke, and basic CPR techniques. Gain the confidence and knowledge to act quickly and effectively when your pet needs it most.",
                    image: "https://via.placeholder.com/400x300/FFB6C1/000000?text=First+Aid+Image",
                    pricing: "$99/course",
                    duration: "4-hour workshop",
                    idealFor: "All pet owners, professional pet sitters",
                    features: [
                        "Recognizing emergencies",
                        "Administering basic first aid",
                        "Performing pet CPR",
                        "Assembling a pet first aid kit",
                        "Post-course certification"
                    ]
                }
            };
            // --- Search Bar Functionality ---
            


            function filterServices() {
                const searchTerm = $('#serviceSearchInput').val().toLowerCase();
                $('.col-md-4[data-service-keywords]').each(function() {
                    const keywords = $(this).data('service-keywords');
                    const serviceName = $(this).find('h3').text().toLowerCase();
                    const serviceDescription = $(this).find('p').text().toLowerCase();

                    if (serviceName.includes(searchTerm) ||
                        serviceDescription.includes(searchTerm) ||
                        (keywords && keywords.includes(searchTerm))) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }

            $('#serviceSearchButton').on('click', filterServices);
            $('#serviceSearchInput').on('keyup', filterServices);

            // --- Modal Dynamic Content Loading ---
            $('#serviceDetailModal').on('show.bs.modal', function (event) {
                const button = $(event.relatedTarget);
                const serviceId = button.data('service-id');
                const service = servicesData[serviceId];

                const modal = $(this);
                if (service) {
                    modal.find('.modal-title').text(service.title);
                    $('#modalServiceTitle').text(service.title);
                    $('#modalServiceShortDescription').text(service.shortDescription);
                    $('#modalServicePricing').text(service.pricing);
                    $('#modalServiceDuration').text(service.duration);
                    $('#modalServiceIdealFor').text(service.idealFor);
                    $('#modalServiceLongDescription').text(service.longDescription);

                    const featuresList = $('#modalServiceFeatures');
                    featuresList.empty();
                    service.features.forEach(feature => {
                        featuresList.append(`<li><i class="fas fa-check-circle"></i> ${feature}</li>`);
                    });

                    $('#modalBookNowLink').attr('href', 'dashboard-owner.html#book-service?serviceId=' + serviceId);

                } else {
                    modal.find('.modal-title').text("Service Details Not Found");
                    modal.find('.modal-body').html(`
                        <h4 class="text-center text-danger">Service details could not be loaded.</h4>
                        <p class="text-center">The requested service ID was not found. Please try again or select another service.</p>
                    `);
                    modal.find('.modal-footer').html(`
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    `);
                }
            });
        });