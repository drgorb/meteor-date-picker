// Write your package code here!
var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

Template.datePick.created = function () {
    moment.locale("en");
    this.data.now = new ReactiveVar(this.data.initial ? moment(this.data.initial) : moment());
    this.data.selectedDate = new ReactiveVar(this.data.now.get().clone());
    console.log("template created");
}

Template.datePick.helpers({
    selectedFormatedDate: function(){
        if(this.selectedDate.get())
            return this.selectedDate.get().format(this.format || "DD.MM.YYYY");
        else
            return "Date Picker";
    },
    isSelected: function(template){
        if(this.moment){
            return this.moment.isSame(template.selectedDate.get()) ? "selected-date" :  "";
        }
    },
    months: function () {
        var months = [];
        var month;
        for(var i = 0; i < 12; i++){
            month = this.now.get().clone().month(i).date(1);
            months.push({name: month.format("MMMM"), moment: month});
        }
        return months;
    },
    monthName: function () {
        return this.now.get().format("MMMM YYYY");
    },
    weekDays: function () {
        var weekDays = [];
        var myDate = this.now.get();
        for (var i = 0; i < 7; i++) {
            weekDays.push({dayName: myDate.clone().weekday(i).format("ddd")});
        }
        return weekDays;
    },
    weeks: function () {
        var weeks = [];
        var days = [];
        var weekNum = 0;
        var myDate = this.now.get();
        var iDate;
        var maxDays = (daysInMonth[myDate.month()] + 1 + (myDate.month() == 1 && myDate.isLeapYear() ? 1 : 0));
        for (var i = 1; i < maxDays; i++) {
            iDate = myDate.clone().date(i);
            if (weekNum != iDate.week()) {
                if (weekNum > 0) {
                    weeks.push({num: weekNum, days: days})
                    days = [];
                } else {
                    days = [];
                    for (var j = iDate.weekday(); j > 0; j--) {
                        var prevMonthDay = myDate.clone().date(1 - j);
                        days.push({class: "prev-month", day: prevMonthDay.date(), moment: prevMonthDay});
                    }
                }
                weekNum = iDate.week();
            }
            days.push({class: "current-month ", day: i, moment: iDate});
        }

        while (days.length < 7) {
            var nextMonthDay = myDate.clone().date(i++);
            days.push({class: "next-month", day: nextMonthDay.date(), moment: nextMonthDay});
        }
        weeks.push({num: weekNum, days: days})
        return weeks;
    }
})

Template.datePick.events({
    "click #setPrevMonth": function (evt, template) {
        $(template.find("#monthslist")).css("display", "none");
        template.data.now.set(template.data.now.get().subtract({months: 1}));
        evt.stopPropagation();
    },
    "click #setNextMonth": function (evt, template) {
        $(template.find("#monthslist")).css("display", "none");
        template.data.now.set(template.data.now.get().add({months: 1}));
        evt.stopPropagation();
    },
    "click .current-month": function(evt, template) {
        $(template.find("#monthslist")).css("display", "none");
        template.data.selectedDate.set(this.moment);
        if(template.data.closeOnSelect != "true")
            evt.stopPropagation();
    },
    "click .prev-month": function(evt, template) {
        $(template.find("#monthslist")).css("display", "none");
        template.data.now.set(template.data.now.get().subtract({months: 1}));
        template.data.selectedDate.set(this.moment);
        evt.stopPropagation();
    },
    "click .next-month": function(evt, template) {
        $(template.find("#monthslist")).css("display", "none");
        template.data.now.set(template.data.now.get().add({months: 1}));
        template.data.selectedDate.set(this.moment);
        evt.stopPropagation();
    },
    "click #monthListMenu": function(evt, template){
        $(template.find("#monthslist")).css("display", "block");
        evt.stopPropagation();
    },
    "click .month-entry": function(evt, template) {
        $(template.find("#monthslist")).css("display", "none");
        template.data.now.set(this.moment);
        evt.stopPropagation();
    },
    "click #datePicker": function(evt, template){
        $(template.find("#monthslist")).css("display", "none");
    }
})