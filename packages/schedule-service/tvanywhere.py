import schedule
from xml.etree.ElementTree import Element, SubElement, Comment, tostring
from datetime import datetime, timedelta

def MetadataOriginationInformationTable(main):
    MetadataOriginationInformationTable = SubElement(main, 'tva:MetadataOriginationInformationTable')
    MetadataOriginationInformation = SubElement(MetadataOriginationInformationTable, 'tva:MetadataOriginationInformation', {'originID': 'frikanalen.no'})

    Publisher = SubElement(MetadataOriginationInformation, 'tva:Publisher')
    Publisher.text = "Foreningen Frikanalen"

    RightsOwner = SubElement(MetadataOriginationInformation, 'tva:RightsOwner')
    RightsOwner.text = "Foreningen Frikanalen"
    return MetadataOriginationInformationTable

s = schedule.Schedule()
todays_schedule = s.get_date(datetime.now())

main = Element('tva:TVAMain', 
        {
            'rightsOwner': '',
            'xml:lang': 'no',
            'type': 'epg',
            'publisher': 'Foreningen Frikanalen, Tore Sinding Bekkedal',
            'publicationTime': datetime.now().astimezone().isoformat(),
            'xmlns': 'urn:tva:metadata:2019',
            'xmlns:tva': 'urn:tva:metadata:2019',
            'xmlns:mpeg7': 'urn:tva:mpeg7:2008',
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xsi:schemaLocation': 'urn:tva:metadata:2019 http://www.nrk.no/tvanytime/xml/tva_metadata_3-1.xsd',
        })


def ProgramInformationTable(ProgramDescription, DailySchedule):
    ProgramInformationTable = SubElement(ProgramDescription, 'ProgramInformationTable')
    videos = {x.video.ID: (x.video.name, x.organization.name, x.video.CRID) for x in DailySchedule['items']}
    for video_id, (video_name, org_name, CRID) in videos.items():
        ProgramInformation = SubElement(ProgramInformationTable, 'ProgramInformation', {'programId': CRID})
        BasicDescription = SubElement(ProgramInformation, 'BasicDescription')
        Title = SubElement(BasicDescription, 'Title')
        Title.text = org_name + ": " + video_name

def ProgramLocationTable(ProgramDescription, DailySchedule):
    ProgramLocationTable = SubElement(ProgramDescription, 'ProgramLocationTable')
    start = DailySchedule['date'].astimezone().replace(hour=0, minute=0, second=0, microsecond=0)
    end = start + timedelta(days=1) - timedelta(microseconds=1)
    Schedule = SubElement(ProgramLocationTable, 'tva:Schedule', 
            {
                'serviceIDRef': 'frikanalen.no',
                'start': start.isoformat(),
                'end': end.isoformat(),
                })

    for item in DailySchedule['items']:
        SE = SubElement(Schedule, 'ScheduleEvent')
        Program = SubElement(SE, 'Program', { 'crid': item.video.CRID, })

        PublishedStartTime = SubElement(SE, 'PublishedStartTime')
        PublishedStartTime.text = item.start_time.astimezone().isoformat()
        PublishedEndTime = SubElement(SE, 'PublishedEndTime')
        PublishedEndTime.text = item.end_time.astimezone().isoformat()

        ActualStartTime = SubElement(SE, 'ActualStartTime')
        ActualStartTime.text = item.start_time.astimezone().isoformat()
        ActualEndTime = SubElement(SE, 'ActualEndTime')
        ActualEndTime.text = item.end_time.astimezone().isoformat()


def ServiceInformationTable(ProgramDescription):
    ServiceInformationTable = SubElement(ProgramDescription, 'ServiceInformationTable')
    ServiceInformation = SubElement(ServiceInformationTable, 'ServiceInformation', {'serviceId': 'frikanalen.no'})
    Name = SubElement(ServiceInformation, 'Name')
    Name.text = "Frikanalen"




MetadataOriginationInformationTable(main)
ProgramDescription = SubElement(main, 'tva:ProgramDescription')
ProgramInformationTable(ProgramDescription, todays_schedule)
ProgramLocationTable(ProgramDescription, todays_schedule)
ServiceInformationTable(ProgramDescription)



from xml.dom import minidom
print(minidom.parseString(tostring(main)).toprettyxml(indent = "   "))
