﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace CRP.Models.ViewModels
{
    public class ReportViewModel
    {
        public int booking { get; set; }
        public int bookingSuccess { get; set; }
        public int vehicle { get; set; }
        public float money { get; set; }
        public int provider { get; set; }
        public int providerActive { get; set; }
        public int customer { get; set; }
        public int customerActive { get; set; }
        public int garage { get; set; }
        public int garageActive { get; set; }
    }

    public class ReportProviderViewModel
    {
        public string ID { get; set; }
        public String ProviderName { get; set; }
        public double money { get; set; }
        public double compare { get; set; }
        public int car { get; set; }
        public Boolean status { get; set; }
    }

    public class ReportGarageViewModel
    {
        public int ID { get; set; }
        public String GarageName { get; set; }
        public double money { get; set; }
        public double compare { get; set; }
        public int car { get; set; }
        public string owner { get; set; }
        public Boolean status { get; set; }
    }
    public class UserViewModel
    {
        public string ID { get; set; }
        public String UserName { get; set; }
        public String Email { get; set; }
        public string phoneNumber { get; set; }
        public String role { get; set; }
        public String providerUtil { get; set; }
        public Boolean status { get; set; }
    }

    public class ProviderReportViewModel
    {
        public string ID { get; set; }
        public String ProviderName { get; set; }
        public double money { get; set; }
        public int booking { get; set; }
        public int car { get; set; }
        public String providerUtil { get; set; }
        public List<CommentModel> comment { get; set; }
    }

    public class CommentModel
    {
        public String UserName { get; set; }
        public String Comment { get; set; }
        public decimal star { get; set; }
    }
    public class ReportMoneyViewModel
    {
        public YearMonthModel Time { get; set; }
        public double Money { get; set; }
    }
    public class YearMonthModel
    {
        public int Year { get; set; }
        public int Month { get; set; }
    }
    public class ReportBookingInYear
    {
        public int month1 { get; set; }
        public int month2 { get; set; }
        public int month3 { get; set; }
        public int month4 { get; set; }
        public int month5 { get; set; }
        public int month6 { get; set; }
        public int month7 { get; set; }
        public int month8 { get; set; }
        public int month9 { get; set; }
        public int month10 { get; set; }
        public int month11 { get; set; }
        public int month12 { get; set; }

    }
}