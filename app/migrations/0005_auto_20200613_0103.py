# Generated by Django 3.0.5 on 2020-06-13 01:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_auto_20200613_0055'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='completes_on',
            field=models.DateTimeField(default=None, null=True),
        ),
    ]
