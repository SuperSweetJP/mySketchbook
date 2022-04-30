
def Content():

    TAB_DICT = {
        "3D" : "threeD",
        "DATA" : "data"
    }

    TOPIC_DICT = {
        "3D": 
            [
                #0 CardTitle, 1 CardType, 2 SupportingText, 3 Date, 4 Link (optional), 5 [Chips], 6 Width(col), [7 image loc, descr, width] (optional)
                [
                    "Chess Knight model", 
                    "seethrough-card", 
                    "A knight chess piece model. Procedurally generated textures that were baked into an image.", 
                    "10/04/2022", 
                    "chess_knight", 
                    ["Blender", "ThreeJs"],
                    6,
                    # r"img/gifs/ClampQuaternion.gif"
                ]
                ,[
                    "Clamp quaternion", 
                    "seethrough-card", 
                    "Code snippet for limiting quaternion rotation on two axes.", 
                    "13/02/2022", 
                    "clamp_quaternion", 
                    ["Quaternion", "Rotation", "Unity3D"],
                    6,
                    # r"img/gifs/ClampQuaternion.gif"
                ]
                ,[
                    "Randomized building generator", 
                    "seethrough-card", 
                    "Played around with javascript ThreeJS library, to create randomized building blocks. Warning, quite resource heavy.", 
                    "04/02/2022", 
                    "cityScape",
                    ["ThreeJS"],
                    6
                ]
                ,[
                    "Swarm model animated", 
                    "seethrough-card", 
                    "For performance testing on mobile", 
                    "03/10/2021", 
                    "swarm_model_anim",
                    ["Blender", "ThreeJS"],
                    6
                ]
                ,[
                    "Swarm model", 
                    "seethrough-card", 
                    "A creepy crawly. My first complete model, along with some textures", 
                    "03/10/2021", 
                    "swarm_model",
                    ["Blender", "ThreeJS"],
                    6
                ]
            ],
        "DATA": 
            [
                # CardTitle, CardType, SupportingText, Date, Link, [Chips], Width(col)-optional
                [
                    "Vehicle project data", 
                    "seethrough-card", 
                    "Data gathered by web scraper, to be used in Vehicle Project.", 
                    "23/04/2022", 
                    "web_scraper", 
                    ["Python", "MySQL", "WebScraper"],
                    6,
                    # r"img/gifs/ClampQuaternion.gif"
                ]
                # ,[
                #     "BOM journal creation2", 
                #     "seethrough-card", 
                #     "The victory is imminent, push forward with boldness", 
                #     "02/02/2022", 
                #     "text_entry2",
                #     ["Accounts payable", "Receipt", "Vendor"]
                # ]
            ]
    }

    CAR_MAKE_DICT = {
        "Alfa-Romeo" : "https://www.ss.lv/lv/transport/cars/alfa-romeo/sell/",
        "Audi" : "https://www.ss.lv/lv/transport/cars/audi/sell/",
        "BMW" : "https://www.ss.lv/lv/transport/cars/bmw/sell/",
        "Cadilliac" : "https://www.ss.lv/lv/transport/cars/cadillac/sell/",
        "Chevrolet" : "https://www.ss.lv/lv/transport/cars/chevrolet/sell/",
        "Chrysler" : "https://www.ss.lv/lv/transport/cars/chrysler/sell/",
        "Citroen" : "https://www.ss.lv/lv/transport/cars/citroen/sell/",
        "Dacia" : "https://www.ss.lv/lv/transport/cars/dacia/sell/",
        "Daewoo" : "https://www.ss.lv/lv/transport/cars/daewoo/sell/",
        "Dodge" : "https://www.ss.lv/lv/transport/cars/dodge/sell/",
        "Fiat" : "https://www.ss.lv/lv/transport/cars/fiat/sell/",
        "Ford" : "https://www.ss.lv/lv/transport/cars/ford/sell/",
        "Honda" : "https://www.ss.lv/lv/transport/cars/honda/sell/",
        "Hyundai" : "https://www.ss.lv/lv/transport/cars/hyundai/sell/",
        "Infinity" : "https://www.ss.lv/lv/transport/cars/infiniti/sell/",
        "Jaguar" : "https://www.ss.lv/lv/transport/cars/jaguar/sell/",
        "Jeep" : "https://www.ss.lv/lv/transport/cars/jeep/sell/",
        "Kia" : "https://www.ss.lv/lv/transport/cars/kia/sell/",
        "Lancia" : "https://www.ss.lv/lv/transport/cars/lancia/sell/",
        "Land-Rover" : "https://www.ss.lv/lv/transport/cars/land-rover/sell/",
        "Lexus" : "https://www.ss.lv/lv/transport/cars/lexus/sell/",
        "Mazda" : "https://www.ss.lv/lv/transport/cars/mazda/sell/",
        "Mercedes" : "https://www.ss.lv/lv/transport/cars/mercedes/sell/",
        "Mini" : "https://www.ss.lv/lv/transport/cars/mini/sell/",
        "Mitsubishi" : "https://www.ss.lv/lv/transport/cars/mitsubishi/sell/",
        "Nissan" : "https://www.ss.lv/lv/transport/cars/nissan/sell/",
        "Opel" : "https://www.ss.lv/lv/transport/cars/opel/sell/",
        "Peugeot" : "https://www.ss.lv/lv/transport/cars/peugeot/sell/",
        "Porsche" : "https://www.ss.lv/lv/transport/cars/porsche/sell/",
        "Renault" : "https://www.ss.lv/lv/transport/cars/renault/sell/",
        "Saab" : "https://www.ss.lv/lv/transport/cars/saab/sell/",
        "Seat" : "https://www.ss.lv/lv/transport/cars/seat/sell/",
        "Skoda" : "https://www.ss.lv/lv/transport/cars/skoda/sell/",
        "Ssangyong" : "https://www.ss.lv/lv/transport/cars/ssangyong/sell/",
        "Subaru" : "https://www.ss.lv/lv/transport/cars/subaru/sell/",
        "Suzuki" : "https://www.ss.lv/lv/transport/cars/suzuki/sell/",
        "Toyota" : "https://www.ss.lv/lv/transport/cars/toyota/sell/",
        "Volkswagen" : "https://www.ss.lv/lv/transport/cars/volkswagen/sell/",
        "Volvo" : "https://www.ss.lv/lv/transport/cars/volvo/sell/"
    }
    
    return TOPIC_DICT, TAB_DICT, CAR_MAKE_DICT