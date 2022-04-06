
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
                    "Clamp quaternion [Unity3D]", 
                    "seethrough-card", 
                    "Code snippet for limiting quaternion rotation on two axes.", 
                    "13/02/2022", 
                    "clamp_quaternion", 
                    ["Quaternion", "Rotation", "Unity3D"],
                    6,
                    # r"img/gifs/ClampQuaternion.gif"
                ]
                ,[
                    "Randomized building generator [ThreeJS]", 
                    "seethrough-card", 
                    "Played around with javascript ThreeJS library, to create randomized building blocks.", 
                    "04/02/2022", 
                    "cityScape",
                    ["ThreeJS", "WebDev"],
                    6
                ]
                ,[
                    "Swarm model [Blender]", 
                    "seethrough-card", 
                    "A creepy crawly. My first complete model, along with some textures", 
                    "03/10/2021", 
                    "swarm_model",
                    ["Blender"],
                    6
                ]
                ,[
                    "Swarm model animated [Blender]", 
                    "seethrough-card", 
                    "For performance testing on mobile", 
                    "03/10/2021", 
                    "swarm_model_anim",
                    ["Blender"],
                    6
                ]
            ],
        "DATA": 
            [
                #CardTitle, CardType, SupportingText, Date, Link, [Chips], Width(col)-optional
                # [
                #     "Welcome2", 
                #     "seethrough-card", 
                #     "Hey some very intriguing text here. I am kindof thinking about that girl.. She was something.", 
                #     "01/01/2022", 
                #     "text_entry2", 
                #     ["Accounts receivable", "BOM Journal", "Invoice"],
                #     8
                # ],
                # [
                #     "BOM journal creation2", 
                #     "seethrough-card", 
                #     "The victory is imminent, push forward with boldness", 
                #     "02/02/2022", 
                #     "text_entry2",
                #     ["Accounts payable", "Receipt", "Vendor"]
                # ]
            ]
    }
    
    return TOPIC_DICT, TAB_DICT