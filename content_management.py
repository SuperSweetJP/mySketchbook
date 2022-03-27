
def Content():

    TAB_DICT = {
        "3D" : "threeD",
        "DATA" : "dynamicsNotes"
    }

    TOPIC_DICT = {
        "3D": 
            [
                #0 CardTitle, 1 CardType, 2 SupportingText, 3 Date, 4 Link, 5 [Chips], 6 Width(col)
                [
                    "Clamp quaternion", 
                    "quaternion-clamp", 
                    "Code snippet for limiting quaternion rotation on two axes", 
                    "13/02/2022", 
                    "clamp_quaternion", 
                    ["Quaternion", "Rotation", "Unity3D"],
                    4
                ],
                [
                    "ThreeJS example1", 
                    "seethrough-card", 
                    "Played around with ThreeJS library for the first time", 
                    "04/02/2022", 
                    "text_entry2",
                    ["ThreeJS", "WebDev"],
                    4
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