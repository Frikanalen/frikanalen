# Generates JSON schedule for playout
def get_graphics_items(start_time, end_time):
    items = []
    items.append(Clock(start_time, end_time))

def get_schedule(date):
    schedule = []
    previous_item = None
    for item in get_items_from_database(date):
        if previous_item and previous_item.end_time + seconds(2) < item.start_time:
            for graphics_item in get_graphics_items(previous_item.end_time, item.start_time):
                schedule.append(graphics_item)
            schedule.append(item)
    return schedule
