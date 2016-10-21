using CRP.Controllers;
using CRP.Models;
using CRP.Models.Entities;
using CRP.Models.Entities.Services;
using Microsoft.AspNet.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Web;
using System.Web.Mvc;

namespace CRP.Areas.Customer.Controllers
{
    public class BecomeroviderController : BaseController
    {
        // GET: Customer/Becomerovider
        [System.Web.Mvc.Route("becomeProvider")]
        public ActionResult Index()
        {
            return View("~/Areas/Customer/Views/Becomerovider/Index.cshtml");
        }

        public async System.Threading.Tasks.Task<ActionResult> Info()
      {
            String customerID = User.Identity.GetUserId();
            var userService = this.Service<IUserReceiptService>();
            var user = await userService.GetAsync(customerID);
            return View("~/Areas/Customer/Views/Becomerovider/Info.cshtml", user);
        }

        [System.Web.Mvc.Route("Becomerovider/logOut")]
        [System.Web.Mvc.HttpGet]
        public async System.Threading.Tasks.Task<ActionResult> logOut()
        {
            return RedirectToAction("LogOut", "Account");
        }

        [System.Web.Mvc.Route("becomeProvider/payment/{id:int}")]
        [System.Web.Mvc.HttpGet]
        public async System.Threading.Tasks.Task<ActionResult> payment(int id)
        {
            String customerID = User.Identity.GetUserId();
            DateTime today = DateTime.Now;
            SystemService sysService = new SystemService();
            var userService = this.Service<IUserReceiptService>();
            var roleService = this.Service<IRoleService>();
            var user = await userService.GetAsync(customerID);
            var provider = await roleService.GetAsync("2");
            if (user.IsProviderUntil == null || user.IsProviderUntil < today)
            {
                today = DateTime.Now;
            }
            else
            {
                today = user.IsProviderUntil.GetValueOrDefault();
            }
            switch (id)
            {
                case 1:
                    {
                        //set untiel provider trong asuser
                        DateTime providerUtil = today.AddMonths(1);
                        user.IsProviderUntil = providerUtil;
                        //set role thah provier
                        user.AspNetRoles.Add(provider);
                        userService.Update(user);
                        //send mail cho provider
                        sysService.SendMailBecomeProvider("tamntse61384@fpt.edu.vn", user);
                        //Response.Redirect("https://www.nganluong.vn/button_payment.php?receiver=Tamntse61384@fpt.edu.vn&product_name=Booking+Fee&price=10000&return_url=news.zing.vn&comments=Thanh+Toan+Booking+Fee+De+Booking+Xe");
                    }
                    break;
                case 3:
                    {
                        //set untiel provider trong asuser
                        DateTime providerUtil = today.AddMonths(3);
                        user.IsProviderUntil = providerUtil;
                        //set role thah provier
                        user.AspNetRoles.Add(provider);
                        userService.Update(user);
                        //send mail cho provider
                        sysService.SendMailBecomeProvider("tamntse61384@fpt.edu.vn", user);
                        //Response.Redirect("https://www.nganluong.vn/button_payment.php?receiver=Tamntse61384@fpt.edu.vn&product_name=Booking+Fee&price=10000&return_url=news.zing.vn&comments=Thanh+Toan+Booking+Fee+De+Booking+Xe");
                    }
                    break;
                case 6:
                    {
                        //set untiel provider trong asuser
                        DateTime providerUtil = today.AddMonths(6);
                        user.IsProviderUntil = providerUtil;
                        //set role thah provier
                        user.AspNetRoles.Add(provider);
                        userService.Update(user);
                        //send mail cho provider
                        sysService.SendMailBecomeProvider("tamntse61384@fpt.edu.vn", user);
                        //Response.Redirect("https://www.nganluong.vn/button_payment.php?receiver=Tamntse61384@fpt.edu.vn&product_name=Booking+Fee&price=10000&return_url=news.zing.vn&comments=Thanh+Toan+Booking+Fee+De+Booking+Xe");
                    }
                    break;
                default:
                    {
                        //Response.Redirect("https://www.nganluong.vn/button_payment.php?receiver=Tamntse61384@fpt.edu.vn&product_name=Booking+Fee&price=10000&return_url=news.zing.vn&comments=Thanh+Toan+Booking+Fee+De+Booking+Xe");

                    }
                    break;
            }
            return RedirectToAction("Info", "Becomerovider");
        }
    }
}